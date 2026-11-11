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

// Casos de edge/test/test_decisao.cpp portados para o Vitest: um describe por função do C++,
// cada CHECK vira um expect com os mesmos valores.
import { describe, expect, it } from 'vitest'
import { ESTADOS, MOTIVOS, temperaturaValida } from '../src/domain/cshield.js'
import { PASSO, T0, base, sessao } from './helpers.js'

describe('teste_validacao_temperatura (R7)', () => {
  it('aceita só números dentro da faixa física do DHT22', () => {
    expect(temperaturaValida(4.8)).toBe(true)
    expect(temperaturaValida(NaN)).toBe(false)
    expect(temperaturaValida(85.0)).toBe(false)
    expect(temperaturaValida(-50.0)).toBe(false)
    expect(temperaturaValida(-40.0) && temperaturaValida(80.0)).toBe(true)
  })
})

describe('teste_normal (R14)', () => {
  it('leitura boa é NORMAL, sem relés', () => {
    const s = sessao()
    const d = s.avalia(base(), T0)
    expect(d.estado).toBe(ESTADOS.NORMAL)
    expect(d.motivo).toBe(MOTIVOS.NENHUM)
    expect(!d.cortaAquecedor && !d.ligaVentoinha).toBe(true)
  })
})

describe('teste_porta_aberta (R15)', () => {
  it('porta aberta é ATENCAO e não mexe nos relés', () => {
    const s = sessao()
    const l = base()
    l.luzPct = 80.0
    const d = s.avalia(l, T0)
    expect(d.estado === ESTADOS.ATENCAO && d.motivo === MOTIVOS.PORTA_ABERTA).toBe(true)
    expect(!d.cortaAquecedor && !d.ligaVentoinha).toBe(true)
  })
})

describe('teste_deriva (R16)', () => {
  it('acima de 8 °C e dentro da tolerância é ATENCAO por DERIVA', () => {
    const s = sessao()
    const l = base()
    l.temperatura = 8.5 // acima de 8, dentro da tolerância (até 9)
    s.avalia(l, T0)
    const d = s.avalia(l, T0 + PASSO)
    expect(d.estado === ESTADOS.ATENCAO && d.motivo === MOTIVOS.DERIVA).toBe(true)
  })
})
