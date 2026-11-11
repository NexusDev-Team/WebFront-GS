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
import { K_ATAQUE, K_NORMAL, K_PROTECAO, TEMPO_ATE_SAIR_MIN } from '../src/domain/config.js'
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

// Alvo para o qual o ataque empurra a câmara: calculado para ela cruzar o limite exatamente em
// TEMPO_ATE_SAIR_MIN, qualquer que seja o perfil (jogo rápido: 1 min simulado = 1 s real).
function alvoDoAtaque(perfil, limite) {
  return perfil.tAlvo + (limite - perfil.tAlvo) / (1 - Math.exp(-K_ATAQUE * TEMPO_ATE_SAIR_MIN))
}
const CALOR_SEM_CSHIELD = { ordem: 'CALOR', aquecedorLigado: true, ventoinhaEmergencia: false, refrigeracaoLigada: false }

describe('alvoTermico', () => {
  it('normal: o alvo é o tAlvo do perfil, com a velocidade de repouso', () => {
    expect(alvoTermico({ perfil: VACINA, ordem: 'NORMAL', ...REPOUSO })).toEqual({ alvo: 5, k: K_NORMAL })
    expect(alvoTermico({ perfil: CONGELADO, ordem: 'NORMAL', ...REPOUSO })).toEqual({ alvo: -20, k: K_NORMAL })
  })
  it('calor sem C-Shield: vai além do máximo, rápido', () => {
    for (const perfil of Object.values(PERFIS_EMULADOR)) {
      const r = alvoTermico({ perfil, ...CALOR_SEM_CSHIELD })
      expect(r.k).toBe(K_ATAQUE)
      expect(r.alvo).toBeCloseTo(alvoDoAtaque(perfil, perfil.tMax), 10)
      expect(r.alvo).toBeGreaterThan(perfil.tMax)
    }
  })
  it('calor com C-Shield: aquecedor cortado e ventoinha ligada levam ao tAlvo, mais rápido', () => {
    const r = alvoTermico({ perfil: VACINA, ordem: 'CALOR', aquecedorLigado: false, ventoinhaEmergencia: true, refrigeracaoLigada: false })
    expect(r).toEqual({ alvo: 5, k: K_PROTECAO })
  })
  it('calor com o aquecedor cortado mas sem ventoinha ainda é ataque', () => {
    const r = alvoTermico({ perfil: VACINA, ordem: 'CALOR', aquecedorLigado: false, ventoinhaEmergencia: false, refrigeracaoLigada: false })
    expect(r.alvo).toBeGreaterThan(VACINA.tMax)
  })
  it('calor com a refrigeração do controlador ainda ligada não aquece', () => {
    expect(alvoTermico({ perfil: VACINA, ordem: 'CALOR', ...REPOUSO })).toEqual({ alvo: 5, k: K_NORMAL })
  })
  it('frio sem C-Shield: vai abaixo do mínimo, rápido', () => {
    for (const perfil of Object.values(PERFIS_EMULADOR)) {
      const r = alvoTermico({ perfil, ordem: 'FRIO', ...REPOUSO })
      expect(r.k).toBe(K_ATAQUE)
      expect(r.alvo).toBeCloseTo(alvoDoAtaque(perfil, perfil.tMin), 10)
      expect(r.alvo).toBeLessThan(perfil.tMin)
    }
  })
  it('frio com C-Shield: aquecedor liberado leva ao tAlvo, mais rápido', () => {
    expect(alvoTermico({ perfil: VACINA, ordem: 'FRIO', ...REPOUSO, aquecedorLigado: true })).toEqual({ alvo: 5, k: K_PROTECAO })
  })
})

describe('tempo para sair da faixa (jogo rápido)', () => {
  // Minutos simulados até a temperatura sair da faixa, em passos de 0,05 min.
  function minutosAteSair(perfil, params) {
    const { alvo, k } = alvoTermico({ perfil, ...params })
    let t = perfil.tAlvo
    for (let i = 1; i <= 2000; i++) {
      t = passoTermico(t, alvo, k, 0.05)
      if (t > perfil.tMax || t < perfil.tMin) return i * 0.05
    }
    return Infinity
  }
  it('ataque de calor tira TODOS os perfis da faixa em cerca de 1 min simulado (1 s real)', () => {
    for (const perfil of Object.values(PERFIS_EMULADOR)) {
      const min = minutosAteSair(perfil, CALOR_SEM_CSHIELD)
      expect(min).toBeGreaterThanOrEqual(TEMPO_ATE_SAIR_MIN - 0.1)
      expect(min).toBeLessThanOrEqual(TEMPO_ATE_SAIR_MIN + 0.1)
    }
  })
  it('ataque de frio também, em todos os perfis', () => {
    for (const perfil of Object.values(PERFIS_EMULADOR)) {
      const min = minutosAteSair(perfil, { ordem: 'FRIO', ...REPOUSO })
      expect(min).toBeGreaterThanOrEqual(TEMPO_ATE_SAIR_MIN - 0.1)
      expect(min).toBeLessThanOrEqual(TEMPO_ATE_SAIR_MIN + 0.1)
    }
  })
  it('com C-Shield a câmara volta para dentro da faixa em menos de 1 min simulado', () => {
    const { alvo, k } = alvoTermico({ perfil: VACINA, ordem: 'CALOR', aquecedorLigado: false, ventoinhaEmergencia: true, refrigeracaoLigada: false })
    let t = 12
    let min = 0
    while (t > VACINA.tMax && min < 60) {
      t = passoTermico(t, alvo, k, 0.05)
      min += 0.05
    }
    expect(min).toBeLessThan(1)
  })
})
