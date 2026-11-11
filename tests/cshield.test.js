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
import { SETPOINT_AUSENTE, TRAVA_MS } from '../src/domain/config.js'
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

describe('teste_setpoint_invalido (R20, R17)', () => {
  it('setpoint fora da faixa bloqueia, corta o aquecedor e liga a ventoinha', () => {
    const s = sessao()
    const l = base()
    l.setpoint = 40.0
    const d = s.avalia(l, T0)
    expect(d.estado).toBe(ESTADOS.BLOQUEIO)
    expect(d.motivo).toBe(MOTIVOS.SETPOINT_INVALIDO)
    expect(d.novoBloqueio).toBe(true)
    expect(s.ctx.bloqueios).toBe(1)
    expect(d.cortaAquecedor && d.ligaVentoinha).toBe(true) // R5, R17
    expect(d.travaRestanteMs).toBe(TRAVA_MS)
  })
})

describe('teste_sem_setpoint (R11)', () => {
  it('sem setpoint observado não bloqueia', () => {
    const s = sessao()
    const l = base()
    l.temSetpoint = false
    l.setpoint = SETPOINT_AUSENTE
    expect(s.avalia(l, T0).estado).toBe(ESTADOS.NORMAL)
  })
})

describe('teste_degelo_longo (R21)', () => {
  it('bloqueia só depois de 30 min de degelo comandado', () => {
    const s = sessao()
    const l = base()
    l.degelo = true
    l.hora = 6 // 6h: horário permitido
    let d = s.avalia(l, T0)
    expect(d.estado).toBe(ESTADOS.NORMAL)
    // Dentro dos 30 min: não bloqueia (a cada 60 s; 30 passos = exatamente 30 min).
    for (let i = 1; i <= 30; i++) d = s.avalia(l, T0 + i * 60000)
    expect(d.estado).toBe(ESTADOS.NORMAL)
    // Passou de 30 min: bloqueia.
    d = s.avalia(l, T0 + 31 * 60000)
    expect(d.estado === ESTADOS.BLOQUEIO && d.motivo === MOTIVOS.DEGELO_LONGO).toBe(true)
  })
})

describe('teste_degelo_fora_horario (R22, R13)', () => {
  it('degelo às 12h bloqueia', () => {
    const s = sessao()
    const l = base()
    l.degelo = true
    l.hora = 12 // 12h: fora de 6h e 18h
    const d = s.avalia(l, T0)
    expect(d.estado === ESTADOS.BLOQUEIO && d.motivo === MOTIVOS.DEGELO_FORA_HORARIO).toBe(true)
  })
  it('degelo às 18h (janela permitida) não bloqueia', () => {
    const s = sessao()
    const l = base()
    l.degelo = true
    l.hora = 18
    expect(s.avalia(l, T0).estado).toBe(ESTADOS.NORMAL)
  })
  it('offline (sem hora válida) só vale a duração máxima', () => {
    const s = sessao()
    const l = base()
    l.degelo = true
    l.horaValida = false
    l.hora = 0
    expect(s.avalia(l, T0).estado).toBe(ESTADOS.NORMAL)
  })
})
