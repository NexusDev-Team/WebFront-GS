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

// Porta de teste_perfis (R41) de edge/test/test_decisao.cpp, mais as constantes do config.h
// e os perfis ilustrativos do emulador.
import { describe, expect, it } from 'vitest'
import * as cfg from '../src/domain/config.js'
import { PERFIL_ATIVO, PERFIS_EMULADOR, PERFIS_FIRMWARE, perfilAtivo } from '../src/domain/perfis.js'

describe('teste_perfis (R41)', () => {
  it('vacina vai de 2 a 8 °C', () => {
    expect(PERFIS_FIRMWARE.VACINA.tMin).toBeCloseTo(2, 3)
    expect(PERFIS_FIRMWARE.VACINA.tMax).toBeCloseTo(8, 3)
  })
  it('resfriado vai de 0 a 4 °C', () => {
    expect(PERFIS_FIRMWARE.RESFRIADO.tMin).toBeCloseTo(0, 3)
    expect(PERFIS_FIRMWARE.RESFRIADO.tMax).toBeCloseTo(4, 3)
  })
  it('congelado tem máximo de -18 °C e plasma de -25 °C', () => {
    expect(PERFIS_FIRMWARE.CONGELADO.tMax).toBeCloseTo(-18, 3)
    expect(PERFIS_FIRMWARE.CONGELADO.tMin).toBeCloseTo(-30, 3)
    expect(PERFIS_FIRMWARE.PLASMA.tMax).toBeCloseTo(-25, 3)
    expect(PERFIS_FIRMWARE.PLASMA.tMin).toBeCloseTo(-40, 3)
  })
  it('a tolerância é de 1 °C em todos os perfis', () => {
    for (const p of Object.values(PERFIS_FIRMWARE)) expect(p.tolerancia).toBeCloseTo(1, 3)
    expect(PERFIS_FIRMWARE.VACINA.tolerancia).toBeCloseTo(1, 3)
  })
  it('o perfil ativo é a vacina', () => {
    expect(PERFIL_ATIVO).toBe('VACINA')
    expect(perfilAtivo().tMax).toBeCloseTo(8, 3)
  })
})

describe('formato único dos perfis', () => {
  it('todos têm id, nome, tMin, tMax, tAlvo e tolerancia', () => {
    for (const p of [...Object.values(PERFIS_FIRMWARE), ...Object.values(PERFIS_EMULADOR)]) {
      expect(Object.keys(p).sort()).toEqual(['id', 'nome', 'tAlvo', 'tMax', 'tMin', 'tolerancia'])
    }
  })
  it('o emulador tem vacina, insulina, plasma e congelado com o alvo dentro da faixa', () => {
    expect(Object.keys(PERFIS_EMULADOR).sort()).toEqual(['CONGELADO', 'INSULINA', 'PLASMA', 'VACINA'])
    for (const p of Object.values(PERFIS_EMULADOR)) {
      expect(p.tAlvo).toBeGreaterThanOrEqual(p.tMin)
      expect(p.tAlvo).toBeLessThanOrEqual(p.tMax)
    }
  })
})

describe('constantes do config.h', () => {
  it('espelha os valores do firmware', () => {
    expect(cfg.JANELA_TAXA_MS).toBe(60000)
    expect(cfg.PERIODO_LEITURA_MS).toBe(2000)
    expect(cfg.N_AMOSTRAS_TAXA).toBe(31)
    expect(cfg.TAXA_MIN_INTERVALO_MS).toBe(10000)
    expect(cfg.TAXA_MAX_C_POR_MIN).toBe(0.5)
    expect(cfg.TAXA_MAX_RESFRIAMENTO_C_POR_MIN).toBe(0.5)
    expect(cfg.DEGELO_MAX_MS).toBe(30 * 60 * 1000)
    expect([cfg.HORA_DEGELO_1, cfg.HORA_DEGELO_2, cfg.JANELA_DEGELO_H]).toEqual([6, 18, 1])
    expect(cfg.TRAVA_MS).toBe(60000)
    expect(cfg.LIBERACAO_MS).toBe(3000)
    expect(cfg.CONFIRMACOES).toBe(2)
    expect([cfg.DHT_TEMP_MIN_FISICA, cfg.DHT_TEMP_MAX_FISICA]).toEqual([-40, 80])
    expect(cfg.LIMIAR_PORTA_PCT).toBe(40)
    expect(cfg.ALARME_INICIAL_MS).toBe(5000)
    expect(cfg.ALTERNA_TELA_MS).toBe(2000)
    expect([cfg.SETPOINT_DEMO_NORMAL, cfg.SETPOINT_DEMO_ATAQUE, cfg.SETPOINT_AUSENTE]).toEqual([5, 45, -999])
    expect(cfg.LED_PISCA_MS).toBe(400)
  })
  it('separa as constantes do emulador (demonstração)', () => {
    expect(cfg.EMULADOR_TRAVA_MS_REAL).toBe(10000)
    expect(cfg.EMULADOR_MINUTOS_POR_SEGUNDO).toBe(1)
  })
})
