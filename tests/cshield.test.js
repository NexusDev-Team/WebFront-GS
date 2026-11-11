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
import {
  SETPOINT_AUSENTE,
  TAXA_MAX_C_POR_MIN,
  TAXA_MAX_RESFRIAMENTO_C_POR_MIN,
  TRAVA_MS,
} from '../src/domain/config.js'
import { ESTADOS, MOTIVOS, temperaturaValida } from '../src/domain/cshield.js'
import { PASSO, T0, base, bloquearPorSetpoint, sessao } from './helpers.js'

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

describe('teste_aquecimento_rapido_porta_fechada (R23)', () => {
  it('+0,1 °C a cada 2 s (3 °C/min) com a porta fechada bloqueia', () => {
    const s = sessao()
    const l = base()
    let d
    let bloqueou = false
    for (let i = 0; i < 10; i++) {
      l.temperatura = 5.0 + 0.1 * i
      d = s.avalia(l, T0 + i * PASSO)
      if (d.estado === ESTADOS.BLOQUEIO) {
        bloqueou = true
        break
      }
    }
    expect(bloqueou).toBe(true)
    expect(d.motivo).toBe(MOTIVOS.AQUECIMENTO_RAPIDO)
    expect(d.taxaCPorMin).toBeGreaterThan(TAXA_MAX_C_POR_MIN)
  })
})

describe('teste_aquecimento_rapido_porta_aberta (R24, R15)', () => {
  it('com a porta aberta a subida rápida é só ATENCAO', () => {
    const s = sessao()
    const l = base()
    l.luzPct = 80.0
    let d
    for (let i = 0; i < 10; i++) {
      l.temperatura = 5.0 + 0.1 * i
      d = s.avalia(l, T0 + i * PASSO)
    }
    expect(d.estado === ESTADOS.ATENCAO && d.motivo === MOTIVOS.PORTA_ABERTA).toBe(true)
    expect(d.taxaCPorMin).toBeGreaterThan(TAXA_MAX_C_POR_MIN) // a taxa estava alta, mas não bloqueou
    expect(s.ctx.bloqueios).toBe(0)
  })
})

// Ataque que ESFRIA: o bloqueio é o espelho do aquecimento (aquecedor liberado, sem ventoinha).
describe('teste_ataque_frio (R52 a R54)', () => {
  it('resfriamento rápido: 5 °C a 3 °C em 10 s bloqueia sem cortar nem ventilar', () => {
    const s = sessao()
    const l = base()
    let d
    for (let i = 0; i <= 5; i++) {
      l.temperatura = 5.0 - 0.4 * i
      d = s.avalia(l, T0 + i * PASSO)
    }
    expect(d.estado === ESTADOS.BLOQUEIO && d.motivo === MOTIVOS.RESFRIAMENTO_RAPIDO).toBe(true)
    expect(d.bloqueado && d.novoBloqueio && s.ctx.bloqueios === 1).toBe(true) // abriu neste ciclo
    expect(d.taxaCPorMin).toBeLessThan(-TAXA_MAX_RESFRIAMENTO_C_POR_MIN)
    expect(!d.cortaAquecedor && !d.ligaVentoinha).toBe(true) // frio: nada de cortar nem de ventilar
  })
  it('porta aberta não explica esfriar: também bloqueia', () => {
    const s = sessao()
    const l = base()
    l.luzPct = 80.0
    let d
    for (let i = 0; i <= 5; i++) {
      l.temperatura = 5.0 - 0.4 * i
      d = s.avalia(l, T0 + i * PASSO)
    }
    expect(d.estado === ESTADOS.BLOQUEIO && d.motivo === MOTIVOS.RESFRIAMENTO_RAPIDO).toBe(true)
  })
  it('setpoint baixo demais (0 °C): frio, relés em repouso; a temperatura manda na resposta', () => {
    const s = sessao()
    const l = base()
    l.setpoint = 0.0
    let d = s.avalia(l, T0)
    expect(d.estado === ESTADOS.BLOQUEIO && d.motivo === MOTIVOS.SETPOINT_INVALIDO && d.bloqueado).toBe(true)
    expect(!d.cortaAquecedor && !d.ligaVentoinha).toBe(true)
    l.temperatura = 9.5 // se passar do calor, a resposta vira a do calor
    d = s.avalia(l, T0 + PASSO)
    expect(d.cortaAquecedor && d.ligaVentoinha).toBe(true)
    l.temperatura = 5.0 // voltou à faixa: segue a direção do bloqueio (frio)
    d = s.avalia(l, T0 + 2 * PASSO)
    expect(!d.cortaAquecedor && !d.ligaVentoinha && d.bloqueado).toBe(true)
  })
  it('bloqueio quente cuja temperatura cai abaixo da faixa libera o aquecedor e depois retoma o calor', () => {
    const s = sessao()
    const t = bloquearPorSetpoint(s)
    const l = base()
    l.temperatura = 1.5
    let d = s.avalia(l, t + PASSO)
    expect(d.bloqueado && !d.cortaAquecedor && !d.ligaVentoinha).toBe(true)
    l.temperatura = 5.0 // e de volta: retoma a direção original (calor)
    d = s.avalia(l, t + 2 * PASSO)
    expect(d.cortaAquecedor && d.ligaVentoinha).toBe(true)
  })
})
