/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Vision. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */

// Modelo térmico ilustrativo do emulador: alvo por situação e passo de Newton.
import { describe, expect, it } from 'vitest'
import { K_ATAQUE, K_NORMAL, K_PROTECAO, SETPOINT_DEMO_ATAQUE } from '../src/domain/config.js'
import { alvoTermico, passoTermico } from '../src/domain/fisica.js'
import { PERFIS_EMULADOR } from '../src/domain/perfis.js'

const VACINA = PERFIS_EMULADOR.VACINA
const CONGELADO = PERFIS_EMULADOR.CONGELADO
// Equipamentos em repouso: aquecedor desligado, sem ventoinha de emergência, refrigeração ligada.
const REPOUSO = { aquecedorLigado: false, ventoinhaEmergencia: false, refrigeracaoLigada: true }

describe('constantes de velocidade', () => {
  it('a proteção é mais rápida que o ataque e o ataque mais rápido que o repouso', () => {
    expect(K_PROTECAO).toBeGreaterThan(K_ATAQUE)
    expect(K_ATAQUE).toBeGreaterThan(0)
    expect(K_NORMAL).toBeGreaterThan(0)
  })
})

describe('passoTermico', () => {
  it('não muda com dt zero nem quando já está no alvo', () => {
    expect(passoTermico(5, 45, K_ATAQUE, 0)).toBe(5)
    expect(passoTermico(45, 45, K_ATAQUE, 1)).toBe(45)
  })
  it('esquenta em direção ao alvo e esfria em direção ao alvo', () => {
    expect(passoTermico(5, 45, K_ATAQUE, 1)).toBeGreaterThan(5)
    expect(passoTermico(12, 5, K_PROTECAO, 1)).toBeLessThan(12)
  })
  it('segue a lei de Newton: T += (alvo − T)(1 − e^(−k·dt))', () => {
    const esperado = 5 + (45 - 5) * (1 - Math.exp(-K_ATAQUE * 2))
    expect(passoTermico(5, 45, K_ATAQUE, 2)).toBeCloseTo(esperado, 10)
  })
  it('converge para o alvo e nunca passa dele, nem com dt enorme', () => {
    let t = 5
    for (let i = 0; i < 2000; i++) {
      const nova = passoTermico(t, 45, K_ATAQUE, 0.5)
      expect(nova).toBeGreaterThanOrEqual(t)
      expect(nova).toBeLessThanOrEqual(45)
      t = nova
    }
    expect(t).toBeCloseTo(45, 3)
    expect(passoTermico(5, 45, K_ATAQUE, 1e6)).toBeLessThanOrEqual(45)
    expect(passoTermico(45, 5, K_PROTECAO, 1e6)).toBeGreaterThanOrEqual(5)
  })
  it('dois passos curtos dão o mesmo resultado de um passo longo', () => {
    const dois = passoTermico(passoTermico(5, 45, K_ATAQUE, 1), 45, K_ATAQUE, 1)
    expect(dois).toBeCloseTo(passoTermico(5, 45, K_ATAQUE, 2), 10)
  })
})

describe('alvoTermico', () => {
  it('normal: o alvo é o tAlvo do perfil, com a velocidade de repouso', () => {
    expect(alvoTermico({ perfil: VACINA, ordem: 'NORMAL', ...REPOUSO })).toEqual({ alvo: 5, k: K_NORMAL })
    expect(alvoTermico({ perfil: CONGELADO, ordem: 'NORMAL', ...REPOUSO })).toEqual({ alvo: -20, k: K_NORMAL })
  })
  it('calor sem C-Shield: vacina vai a 45 °C (o setpoint do atacante)', () => {
    const r = alvoTermico({
      perfil: VACINA,
      ordem: 'CALOR',
      aquecedorLigado: true,
      ventoinhaEmergencia: false,
      refrigeracaoLigada: false,
    })
    expect(r).toEqual({ alvo: SETPOINT_DEMO_ATAQUE, k: K_ATAQUE })
  })
  it('calor sem C-Shield: congelado vai a tMax + 30', () => {
    const r = alvoTermico({
      perfil: CONGELADO,
      ordem: 'CALOR',
      aquecedorLigado: true,
      ventoinhaEmergencia: false,
      refrigeracaoLigada: false,
    })
    expect(r).toEqual({ alvo: CONGELADO.tMax + 30, k: K_ATAQUE })
  })
  it('calor com C-Shield: aquecedor cortado e ventoinha ligada levam ao tAlvo, mais rápido', () => {
    const r = alvoTermico({
      perfil: VACINA,
      ordem: 'CALOR',
      aquecedorLigado: false,
      ventoinhaEmergencia: true,
      refrigeracaoLigada: false,
    })
    expect(r).toEqual({ alvo: 5, k: K_PROTECAO })
  })
  it('calor com o aquecedor cortado mas sem ventoinha ainda é ataque', () => {
    const r = alvoTermico({
      perfil: VACINA,
      ordem: 'CALOR',
      aquecedorLigado: false,
      ventoinhaEmergencia: false,
      refrigeracaoLigada: false,
    })
    expect(r.alvo).toBe(SETPOINT_DEMO_ATAQUE)
  })
  it('calor com a refrigeração do controlador ainda ligada não aquece', () => {
    const r = alvoTermico({ perfil: VACINA, ordem: 'CALOR', ...REPOUSO })
    expect(r).toEqual({ alvo: 5, k: K_NORMAL })
  })
  it('frio sem C-Shield: vai a tMin − 12', () => {
    const r = alvoTermico({ perfil: VACINA, ordem: 'FRIO', ...REPOUSO })
    expect(r).toEqual({ alvo: VACINA.tMin - 12, k: K_ATAQUE })
  })
  it('frio com C-Shield: aquecedor liberado leva ao tAlvo, mais rápido', () => {
    const r = alvoTermico({ perfil: VACINA, ordem: 'FRIO', ...REPOUSO, aquecedorLigado: true })
    expect(r).toEqual({ alvo: 5, k: K_PROTECAO })
  })
})

describe('tempo para sair da faixa (calibragem de K_ATAQUE)', () => {
  // Minutos simulados até a temperatura sair da faixa, em passos de 0,1 min.
  function minutosAteSair(perfil, params, inicio) {
    const { alvo, k } = alvoTermico({ perfil, ...params })
    let t = inicio
    for (let i = 1; i <= 600; i++) {
      t = passoTermico(t, alvo, k, 0.1)
      if (t > perfil.tMax || t < perfil.tMin) return i * 0.1
    }
    return Infinity
  }
  const calor = { ordem: 'CALOR', aquecedorLigado: true, ventoinhaEmergencia: false, refrigeracaoLigada: false }

  it('ataque de calor sem proteção tira a vacina da faixa em 2 a 4 min simulados', () => {
    const min = minutosAteSair(VACINA, calor, VACINA.tAlvo)
    expect(min).toBeGreaterThanOrEqual(2)
    expect(min).toBeLessThanOrEqual(4)
  })
  it('o mesmo vale para o congelado', () => {
    const min = minutosAteSair(CONGELADO, calor, CONGELADO.tAlvo)
    expect(min).toBeGreaterThanOrEqual(2)
    expect(min).toBeLessThanOrEqual(4)
  })
  it('com C-Shield a câmara volta para dentro da faixa em menos de 3 min', () => {
    const { alvo, k } = alvoTermico({
      perfil: VACINA,
      ordem: 'CALOR',
      aquecedorLigado: false,
      ventoinhaEmergencia: true,
      refrigeracaoLigada: false,
    })
    let t = 12
    let min = 0
    while (t > VACINA.tMax && min < 60) {
      t = passoTermico(t, alvo, k, 0.1)
      min += 0.1
    }
    expect(min).toBeLessThan(3)
  })
})
