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

// Saídas derivadas da decisão: teste_ventoinha_refrigeracao_no_bloqueio (R57) portado do C++,
// e cor do LED (atuadores.h).
import { describe, expect, it } from 'vitest'
import { ESTADOS } from '../src/domain/cshield.js'
import { corLed, ventoinhaRefrigeracao } from '../src/domain/cshield-saida.js'

describe('teste_ventoinha_refrigeracao_no_bloqueio (R57)', () => {
  it('no bloqueio só dá para ligar a ventoinha de novo, nunca desligá-la', () => {
    let v = true
    v = ventoinhaRefrigeracao(v, false, true)
    expect(v).toBe(true) // sem bloqueio segue a chave: normal
    v = ventoinhaRefrigeracao(v, false, false)
    expect(v).toBe(false) // o ataque desliga a ventoinha
    v = ventoinhaRefrigeracao(v, true, false)
    expect(v).toBe(false) // bloqueio: continua desligada
    v = ventoinhaRefrigeracao(v, true, true)
    expect(v).toBe(true) // dá para ligar de novo
    v = ventoinhaRefrigeracao(v, true, false)
    expect(v).toBe(true) // atacar de novo não desliga
    v = ventoinhaRefrigeracao(v, true, false)
    expect(v).toBe(true)
    v = ventoinhaRefrigeracao(v, false, false)
    expect(v).toBe(false) // liberado: volta a seguir a chave
    v = ventoinhaRefrigeracao(v, false, true)
    expect(v).toBe(true)
  })
})

describe('corLed', () => {
  it('uma cor por estado', () => {
    expect(corLed({ estado: ESTADOS.NORMAL, bloqueado: false })).toBe('verde')
    expect(corLed({ estado: ESTADOS.ATENCAO, bloqueado: false })).toBe('amarelo')
    expect(corLed({ estado: ESTADOS.CRITICO, bloqueado: false })).toBe('vermelho')
    expect(corLed({ estado: ESTADOS.FALHA_SENSOR, bloqueado: false })).toBe('amarelo-pisca')
    expect(corLed({ estado: ESTADOS.BLOQUEIO, bloqueado: true })).toBe('azul')
  })
  it('azul fixo sempre que há bloqueio, mesmo em CRITICO', () => {
    expect(corLed({ estado: ESTADOS.CRITICO, bloqueado: true })).toBe('azul')
    expect(corLed({ estado: ESTADOS.FALHA_SENSOR, bloqueado: true })).toBe('azul')
  })
})
