/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Dev. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */

// A vista de uma câmara: o que o LCD, o LED e os equipamentos mostram para o local selecionado.
import { describe, expect, it } from 'vitest'
import { LOCAIS, atacar, criarCidade, passo } from '../src/domain/cidade.js'
import { vistaDaCamara } from '../src/domain/camara-vista.js'
import { PERFIS_EMULADOR } from '../src/domain/perfis.js'

function avancar(c, segundosReais) {
  for (let ms = 0; ms < segundosReais * 1000; ms += 100) c = passo(c, 100)
  return c
}
function vista(cidade, id, extra = {}) {
  const def = LOCAIS.find((l) => l.id === id)
  return vistaDaCamara({
    local: cidade.locais[id],
    perfil: PERFIS_EMULADOR[def.perfil],
    relogioSimMs: cidade.relogioSimMs,
    agoraRealMs: 0,
    progressoLiberacao: 0,
    aviso: null,
    ...extra,
  })
}
const VILA = 'ubs-vila-mariana'
const BRAS = 'ubs-brasilandia'

describe('local sem C-Shield', () => {
  it('não tem LCD nem LED, mas mostra os equipamentos e o ataque', () => {
    const c = avancar(atacar(criarCidade(), BRAS, 'CALOR', 0), 2)
    const v = vista(c, BRAS)
    expect(v.temCShield).toBe(false)
    expect(v.lcd).toBeNull()
    expect(v.corLed).toBeNull()
    expect(v.equipamentos).toEqual({ aquecedor: 'ligado', ventoinhaEmergencia: false, refrigeracao: false })
    expect(v.controlador).toBe('ATAQUE')
    expect(v.setpointMandado).toBe(45)
  })
  it('sem ataque tudo está em repouso e a ordem é normal', () => {
    const v = vista(criarCidade(), BRAS)
    expect(v.equipamentos).toEqual({ aquecedor: 'parado', ventoinhaEmergencia: false, refrigeracao: true })
    expect(v.controlador).toBe('NORMAL')
    expect(v.setpointMandado).toBe(PERFIS_EMULADOR.VACINA.tAlvo)
  })
})

describe('local com C-Shield: LCD', () => {
  it('antes do primeiro ciclo mostra a tela de boot', () => {
    expect(vista(criarCidade(), VILA).lcd).toEqual(['C-Shield', 'Iniciando...'])
  })
  it('em repouso mostra Ideal e a temperatura', () => {
    const c = avancar(criarCidade(), 1)
    expect(vista(c, VILA).lcd).toEqual(['Estado: Ideal', 'Temp: 5.0°C'])
    expect(vista(c, VILA).corLed).toBe('verde')
  })
  it('no bloqueio alterna a cada 2 s reais e conta a trava em segundos reais', () => {
    const c = avancar(atacar(criarCidade(), VILA, 'CALOR', 0), 1)
    expect(vista(c, VILA, { agoraRealMs: 0 }).lcd).toEqual(['Estado: Bloqueio', 'Temp: 5.0°C'])
    expect(vista(c, VILA, { agoraRealMs: 2000 }).lcd).toEqual(['Estado: Bloqueio', 'Alt. de Setpoint'])
    expect(vista(c, VILA, { agoraRealMs: 4000 }).lcd).toEqual(['Estado: Bloqueio', 'Liberacao em 9s'])
    expect(vista(c, VILA).corLed).toBe('azul')
  })
  it('depois da trava pede para segurar o botão', () => {
    const c = avancar(atacar(criarCidade(), VILA, 'CALOR', 0), 11)
    expect(vista(c, VILA, { agoraRealMs: 4000 }).lcd).toEqual(['Estado: Bloqueio', 'Segure botao 3s'])
  })
  it('segurando o botão mostra a barra de progresso', () => {
    const c = avancar(atacar(criarCidade(), VILA, 'CALOR', 0), 1)
    expect(vista(c, VILA, { progressoLiberacao: 0.5 }).lcd).toEqual(['Liberando...', '█'.repeat(8)])
    expect(vista(c, VILA, { progressoLiberacao: 1 }).lcd[1]).toBe('█'.repeat(16))
  })
  it('avisos temporários passam à frente do estado, até acabar o prazo', () => {
    const c = avancar(atacar(criarCidade(), VILA, 'CALOR', 0), 1)
    const trava = { tipo: 'TRAVA', ateRealMs: 3000 }
    expect(vista(c, VILA, { aviso: trava, agoraRealMs: 1000 }).lcd).toEqual(['Trava ativa', 'Aguarde 9s'])
    expect(vista(c, VILA, { aviso: trava, agoraRealMs: 3000 }).lcd[0]).toBe('Estado: Bloqueio')
    expect(vista(c, VILA, { aviso: { tipo: 'LIBERADO', ateRealMs: 3000 }, agoraRealMs: 0 }).lcd).toEqual([
      'Estado: Liberado',
      'Controle normal',
    ])
    expect(vista(c, VILA, { aviso: { tipo: 'SEM_BLOQUEIO', ateRealMs: 3000 }, agoraRealMs: 0 }).lcd).toEqual([
      'Sem bloqueio',
      'Nada a liberar',
    ])
  })
})

describe('local com C-Shield: equipamentos e ordem', () => {
  it('ataque de calor: aquecedor cortado, ventoinha de emergência ligada, refrigeração desligada', () => {
    const c = avancar(atacar(criarCidade(), VILA, 'CALOR', 0), 1)
    const v = vista(c, VILA)
    expect(v.equipamentos).toEqual({ aquecedor: 'cortado', ventoinhaEmergencia: true, refrigeracao: false })
    expect(v.controlador).toBe('ATAQUE')
    expect(v.setpointMandado).toBe(45)
  })
  it('ataque de frio: aquecedor liberado, sem ventoinha, refrigeração ligada', () => {
    const c = avancar(atacar(criarCidade(), VILA, 'FRIO', 0), 1)
    const v = vista(c, VILA)
    expect(v.equipamentos).toEqual({ aquecedor: 'ligado', ventoinhaEmergencia: false, refrigeracao: true })
    expect(v.setpointMandado).toBe(PERFIS_EMULADOR.VACINA.tMin - 12)
  })
  it('traz a faixa segura do perfil', () => {
    expect(vista(criarCidade(), VILA).faixa).toEqual({ tMin: 2, tMax: 8 })
  })
})
