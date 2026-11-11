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

// Eventos entre dois estados da cidade (novo bloqueio, liberação) e o tempo restante da trava.
import { describe, expect, it } from 'vitest'
import {
  MS_SIM_POR_MS_REAL,
  TRAVA_SIM_MS,
  ativarCShield,
  atacar,
  ataqueEmMassa,
  criarCidade,
  liberar,
  passo,
  travaRestanteSimMs,
} from '../src/domain/cidade.js'
import { eventosDoPasso, resultadoDaLiberacao } from '../src/domain/cidade-eventos.js'

function avancar(c, segundosReais) {
  for (let ms = 0; ms < segundosReais * 1000; ms += 100) c = passo(c, 100)
  return c
}

describe('constantes do tempo do jogo', () => {
  it('1 ms real vale 60 ms simulados e a trava é de 10 s reais', () => {
    expect(MS_SIM_POR_MS_REAL).toBe(60)
    expect(TRAVA_SIM_MS).toBe(600000)
  })
})

describe('eventosDoPasso', () => {
  it('sem mudança não há evento', () => {
    const c = criarCidade()
    expect(eventosDoPasso(c, passo(c, 100))).toEqual({ novosBloqueios: [], liberados: [] })
  })
  it('ataque num local protegido gera um novo bloqueio', () => {
    const antes = atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0)
    const ev = eventosDoPasso(antes, passo(antes, 34))
    expect(ev.novosBloqueios).toEqual(['ubs-vila-mariana'])
    expect(ev.liberados).toEqual([])
  })
  it('vários ciclos no mesmo quadro ainda contam um bloqueio só', () => {
    const antes = atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0)
    expect(eventosDoPasso(antes, passo(antes, 1000)).novosBloqueios).toEqual(['ubs-vila-mariana'])
  })
  it('bloqueio que já existia não gera evento de novo', () => {
    const antes = avancar(atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0), 1)
    expect(eventosDoPasso(antes, passo(antes, 100)).novosBloqueios).toEqual([])
  })
  it('no ataque em massa só o local protegido bloqueia', () => {
    const antes = ataqueEmMassa(criarCidade(), 'CALOR', 0)
    expect(eventosDoPasso(antes, passo(antes, 100)).novosBloqueios).toEqual(['ubs-vila-mariana'])
  })
  it('ativar o C-Shield num local atacado gera o bloqueio dele', () => {
    const atacada = avancar(atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0), 2)
    const antes = ativarCShield(atacada)
    expect(eventosDoPasso(antes, passo(antes, 100)).novosBloqueios).toEqual(['ubs-brasilandia'])
  })
  it('liberação aceita gera o evento de liberado', () => {
    const bloqueada = avancar(atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0), 11)
    const antes = liberar(bloqueada, 'ubs-vila-mariana')
    const ev = eventosDoPasso(antes, passo(antes, 34))
    expect(ev.liberados).toEqual(['ubs-vila-mariana'])
    expect(ev.novosBloqueios).toEqual([])
  })
  it('recomeçar (cidade nova) não gera evento', () => {
    const antes = avancar(atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0), 1)
    expect(eventosDoPasso(antes, criarCidade())).toEqual({ novosBloqueios: [], liberados: [] })
  })
})

describe('travaRestanteSimMs', () => {
  it('local sem bloqueio não tem trava', () => {
    const c = criarCidade()
    expect(travaRestanteSimMs(c.locais['ubs-vila-mariana'], c.relogioSimMs)).toBe(0)
    expect(travaRestanteSimMs(c.locais['farmacia-mooca'], c.relogioSimMs)).toBe(0)
  })
  it('depois do bloqueio conta de 10 min simulados até zero', () => {
    let c = avancar(atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0), 1)
    const restante = travaRestanteSimMs(c.locais['ubs-vila-mariana'], c.relogioSimMs)
    expect(restante).toBeGreaterThan(0)
    expect(restante).toBeLessThan(TRAVA_SIM_MS)
    c = avancar(c, 10)
    expect(travaRestanteSimMs(c.locais['ubs-vila-mariana'], c.relogioSimMs)).toBe(0)
  })
})

describe('resultadoDaLiberacao', () => {
  const VILA = 'ubs-vila-mariana'
  it('sem bloqueio não há nada a liberar', () => {
    const c = criarCidade()
    expect(resultadoDaLiberacao(liberar(c, VILA), VILA)).toBe('SEM_BLOQUEIO')
    expect(resultadoDaLiberacao(liberar(c, 'farmacia-mooca'), 'farmacia-mooca')).toBe('SEM_BLOQUEIO')
  })
  it('antes da trava é recusada', () => {
    const c = avancar(atacar(criarCidade(), VILA, 'CALOR', 0), 5)
    expect(resultadoDaLiberacao(liberar(c, VILA), VILA)).toBe('RECUSADA')
  })
  it('depois da trava é aceita', () => {
    const c = avancar(atacar(criarCidade(), VILA, 'CALOR', 0), 11)
    expect(resultadoDaLiberacao(liberar(c, VILA), VILA)).toBe('ACEITA')
  })
})
