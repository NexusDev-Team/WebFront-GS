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

// Saídas derivadas da decisão: teste_ventoinha_refrigeracao_no_bloqueio (R57) portado do C++,
// cor do LED (atuadores.h) e relés deduzidos do que o FIWARE publica (edge-contrato-web.md).
import { describe, expect, it } from 'vitest'
import { ESTADOS, MOTIVOS } from '../src/domain/cshield.js'
import { corLed, relesPublicados, ventoinhaRefrigeracao } from '../src/domain/cshield-saida.js'

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
  it('azul fixo sempre que há bloqueio, mesmo em CRITICO (W22)', () => {
    expect(corLed({ estado: ESTADOS.CRITICO, bloqueado: true })).toBe('azul')
    expect(corLed({ estado: ESTADOS.FALHA_SENSOR, bloqueado: true })).toBe('azul')
  })
})

describe('relesPublicados (W41a)', () => {
  const pub = (state, reason, temperature, setpoint) => ({ state, reason, temperature, setpoint })

  it('exemplo do edge-contrato-web.md: BLOQUEIO por setpoint 45 corta, ventila e marca ATAQUE', () => {
    expect(relesPublicados(pub('BLOQUEIO', 'SETPOINT_INVALIDO', 4.9, 45))).toEqual({
      cortaAquecedor: true,
      ligaVentoinha: true,
      controlador: 'ATAQUE',
    })
  })
  it('NORMAL com setpoint 5: nada atua e o controlador está NORMAL', () => {
    expect(relesPublicados(pub('NORMAL', '-', 5, 5))).toEqual({
      cortaAquecedor: false,
      ligaVentoinha: false,
      controlador: 'NORMAL',
    })
  })
  it('só BLOQUEIO e CRITICO atuam', () => {
    for (const estado of ['NORMAL', 'ATENCAO', 'FALHA_SENSOR']) {
      const r = relesPublicados(pub(estado, '-', 5, 5))
      expect(!r.cortaAquecedor && !r.ligaVentoinha).toBe(true)
    }
    const c = relesPublicados(pub('CRITICO', 'TEMP_FORA_TOLERANCIA', 12, 5))
    expect(c.cortaAquecedor && c.ligaVentoinha).toBe(true)
  })
  it('ataque de frio (RESFRIAMENTO_RAPIDO) deixa o aquecedor liberado', () => {
    const r = relesPublicados(pub('BLOQUEIO', MOTIVOS.RESFRIAMENTO_RAPIDO, 4, 5))
    expect(!r.cortaAquecedor && !r.ligaVentoinha).toBe(true)
  })
  it('setpoint abaixo da faixa é ataque de frio e o controlador fica DESCONHECIDO', () => {
    const r = relesPublicados(pub('BLOQUEIO', 'SETPOINT_INVALIDO', 5, 0))
    expect(r).toEqual({ cortaAquecedor: false, ligaVentoinha: false, controlador: 'DESCONHECIDO' })
  })
  it('a temperatura manda: acima da faixa vira resposta de calor mesmo num ataque de frio', () => {
    const r = relesPublicados(pub('BLOQUEIO', 'SETPOINT_INVALIDO', 9.5, 0))
    expect(r.cortaAquecedor && r.ligaVentoinha).toBe(true)
  })
  it('sensor sem leitura (-999) segue a direção do ataque', () => {
    const calor = relesPublicados(pub('BLOQUEIO', 'SETPOINT_INVALIDO', -999, 45))
    expect(calor.cortaAquecedor && calor.ligaVentoinha).toBe(true)
    const frio = relesPublicados(pub('BLOQUEIO', 'RESFRIAMENTO_RAPIDO', -999, 5))
    expect(!frio.cortaAquecedor && !frio.ligaVentoinha).toBe(true)
  })
})
