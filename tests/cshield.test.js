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

// Casos de edge/test/test_decisao.cpp portados para o Vitest: um describe por função do C++,
// cada CHECK vira um expect com os mesmos valores.
import { describe, expect, it } from 'vitest'
import {
  ALARME_INICIAL_MS,
  SETPOINT_AUSENTE,
  TAXA_MAX_C_POR_MIN,
  TAXA_MAX_RESFRIAMENTO_C_POR_MIN,
  TRAVA_MS,
} from '../src/domain/config.js'
import { ESTADOS, MOTIVOS, avaliar, criarContexto, temperaturaValida } from '../src/domain/cshield.js'
import { PASSO, T0, base, bloquearPorSetpoint, quase, sessao } from './helpers.js'

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

describe('teste_sensor_invalido (R7, R9, R19a)', () => {
  it('só confirma FALHA_SENSOR no segundo ciclo inválido e sai quando a leitura volta', () => {
    const s = sessao()
    const l = base()
    l.valida = false
    let d = s.avalia(l, T0)
    expect(d.estado).toBe(ESTADOS.NORMAL) // 1 ciclo inválido ainda não confirma
    d = s.avalia(l, T0 + PASSO)
    expect(d.estado === ESTADOS.FALHA_SENSOR && d.motivo === MOTIVOS.SENSOR_SEM_LEITURA).toBe(true)
    expect(!d.cortaAquecedor && !d.ligaVentoinha).toBe(true)
    d = s.avalia(base(), T0 + 2 * PASSO) // leitura válida volta: sai da falha
    expect(d.estado).toBe(ESTADOS.NORMAL)
  })
})

describe('teste_falha_sensor_mantem_regras_1_e_2 (R29)', () => {
  it('setpoint inválido continua bloqueando com o sensor em falha', () => {
    const s = sessao()
    const l = base()
    l.valida = false
    l.setpoint = 40.0
    s.avalia(l, T0)
    const d = s.avalia(l, T0 + PASSO)
    expect(d.estado === ESTADOS.BLOQUEIO && d.motivo === MOTIVOS.SETPOINT_INVALIDO).toBe(true)
  })
  it('degelo fora do horário continua bloqueando com o sensor em falha', () => {
    const s = sessao()
    const l = base()
    l.valida = false
    l.degelo = true
    l.hora = 12
    s.avalia(l, T0)
    const d = s.avalia(l, T0 + PASSO)
    expect(d.estado === ESTADOS.BLOQUEIO && d.motivo === MOTIVOS.DEGELO_FORA_HORARIO).toBe(true)
  })
})

describe('teste_critico (R18, R9)', () => {
  it('acima de 9 °C por 2 ciclos é CRITICO e liga a ventoinha', () => {
    const s = sessao()
    const l = base()
    l.temperatura = 10.0 // acima de 9 (8 + tolerância)
    let d = s.avalia(l, T0)
    expect(d.estado).not.toBe(ESTADOS.CRITICO) // 1 ciclo ainda não confirma
    d = s.avalia(l, T0 + PASSO)
    expect(d.estado === ESTADOS.CRITICO && d.motivo === MOTIVOS.TEMP_FORA_TOLERANCIA).toBe(true)
    expect(d.cortaAquecedor && d.ligaVentoinha).toBe(true)
  })
  it('abaixo de 1 °C por 2 ciclos é CRITICO, mas no frio o aquecedor fica liberado (R52)', () => {
    const s = sessao()
    const l = base()
    l.temperatura = 0.0
    s.avalia(l, T0)
    const d = s.avalia(l, T0 + PASSO)
    expect(d.estado).toBe(ESTADOS.CRITICO)
    expect(!d.cortaAquecedor && !d.ligaVentoinha).toBe(true)
  })
  it('pico isolado não gera CRITICO', () => {
    const s = sessao()
    const l = base()
    l.temperatura = 10.0
    s.avalia(l, T0)
    l.temperatura = 5.0
    s.avalia(l, T0 + PASSO)
    const d = s.avalia(l, T0 + 2 * PASSO)
    expect(d.estado).toBe(ESTADOS.NORMAL)
  })
})

describe('teste_exposicao (R31)', () => {
  it('acumula °C·min acima de T_MAX e para de acumular abaixo dele', () => {
    const s = sessao()
    const l = base()
    l.temperatura = 10.0 // 2 °C acima de T_MAX (8)
    let d
    for (let i = 0; i < 10; i++) d = s.avalia(l, T0 + i * PASSO)
    // 9 intervalos de 2 s = 18 s = 0,3 min; 2 °C acima => 0,6 °C·min.
    expect(quase(d.exposicao, 0.6)).toBe(true)
    l.temperatura = 5.0 // abaixo de T_MAX não acumula
    const d2 = s.avalia(l, T0 + 10 * PASSO)
    expect(quase(d2.exposicao, d.exposicao)).toBe(true)
  })
})

describe('teste_prioridade (R19)', () => {
  it('CRITICO vence BLOQUEIO e preserva o motivo do ataque', () => {
    const s = sessao()
    const l = base()
    l.setpoint = 40.0
    l.temperatura = 12.0
    s.avalia(l, T0)
    const d = s.avalia(l, T0 + PASSO)
    expect(d.estado).toBe(ESTADOS.CRITICO)
    expect(s.ctx.bloqueado).toBe(true)
    expect(d.motivo).toBe(MOTIVOS.SETPOINT_INVALIDO)
  })
  it('BLOQUEIO vence FALHA_SENSOR', () => {
    const s = sessao()
    const l = base()
    l.valida = false
    l.setpoint = 40.0
    s.avalia(l, T0)
    expect(s.avalia(l, T0 + PASSO).estado).toBe(ESTADOS.BLOQUEIO)
  })
  it('FALHA_SENSOR vence ATENCAO', () => {
    const s = sessao()
    const l = base()
    l.valida = false
    l.luzPct = 80.0
    s.avalia(l, T0)
    expect(s.avalia(l, T0 + PASSO).estado).toBe(ESTADOS.FALHA_SENSOR)
  })
  it('ATENCAO vence NORMAL', () => {
    const s = sessao()
    const l = base()
    l.luzPct = 80.0
    expect(s.avalia(l, T0).estado).toBe(ESTADOS.ATENCAO)
  })
})

describe('teste_ataque_frio: recuperação do calor (R52 a R54)', () => {
  it('voltar do calor até o centro da faixa não é ataque de frio', () => {
    const s = sessao()
    const l = base()
    l.temperatura = 12.0
    s.avalia(l, T0)
    let d = s.avalia(l, T0 + PASSO)
    expect(d.estado === ESTADOS.CRITICO && d.cortaAquecedor && d.ligaVentoinha).toBe(true)
    let t = T0 + PASSO
    for (let temp = 9.0; temp >= 5.0; temp -= 1.0) {
      // cai 30 °C/min até o centro da faixa
      l.temperatura = temp
      t += PASSO
      d = s.avalia(l, t)
    }
    expect(d.estado === ESTADOS.NORMAL && !d.bloqueado).toBe(true)
  })
})

describe('teste_trava_ignora_ordem (R25)', () => {
  it('nova ordem do controlador durante o bloqueio é ignorada e registrada', () => {
    const s = sessao()
    bloquearPorSetpoint(s)
    const l = base()
    l.setpoint = 50.0 // controlador muda de novo
    let d = s.avalia(l, T0 + PASSO)
    expect(d.estado).toBe(ESTADOS.BLOQUEIO)
    expect(d.mudancaIgnorada).toBe(true)
    expect(d.novoBloqueio).toBe(false)
    expect(s.ctx.bloqueios).toBe(1)
    d = s.avalia(l, T0 + 2 * PASSO) // sem nova mudança: nada a registrar
    expect(d.mudancaIgnorada).toBe(false)
  })
})

describe('teste_liberacao_antes_da_trava (R26, R30)', () => {
  it('botão antes da trava mínima não libera e avisa', () => {
    const s = sessao()
    bloquearPorSetpoint(s)
    const l = base()
    l.liberacao = true // setpoint de volta a 5
    const d = s.avalia(l, T0 + TRAVA_MS - PASSO)
    expect(d.estado).toBe(ESTADOS.BLOQUEIO)
    expect(s.ctx.bloqueado).toBe(true)
    expect(d.travaRestanteMs).toBe(PASSO)
    expect(d.liberacaoRecusada && !d.liberou).toBe(true) // o usuário precisa ser avisado
  })
})

describe('teste_liberacao_temperatura_boa (R26)', () => {
  it('liberação com temperatura boa volta ao NORMAL', () => {
    const s = sessao()
    bloquearPorSetpoint(s)
    const l = base()
    l.liberacao = true
    const d = s.avalia(l, T0 + TRAVA_MS)
    expect(d.estado).toBe(ESTADOS.NORMAL)
    expect(s.ctx.bloqueado).toBe(false)
    expect(!d.cortaAquecedor && !d.ligaVentoinha).toBe(true)
    expect(d.travaRestanteMs).toBe(0)
    expect(d.liberou && !d.liberacaoRecusada).toBe(true)
  })
})

describe('teste_liberacao_temperatura_ruim (R27, R18)', () => {
  it('liberação com temperatura ruim vai para CRITICO', () => {
    const s = sessao()
    bloquearPorSetpoint(s)
    const l = base()
    l.temperatura = 12.0 // além da tolerância (acima de 9)
    let d
    let t = T0 + PASSO
    for (; t < T0 + TRAVA_MS + 4000; t += PASSO) d = s.avalia(l, t)
    expect(d.estado).toBe(ESTADOS.CRITICO) // crítico já durante o bloqueio
    l.liberacao = true
    d = s.avalia(l, t) // depois da trava, com o botão
    expect(s.ctx.bloqueado).toBe(false)
    expect(d.estado).toBe(ESTADOS.CRITICO)
    expect(d.cortaAquecedor && d.ligaVentoinha).toBe(true)
  })
})

describe('teste_liberacao_descarta_historico_da_taxa (R26)', () => {
  it('a liberação não reabre o bloqueio por uma subida antiga', () => {
    const s = sessao()
    const l = base()
    l.temperatura = 2.0
    l.setpoint = 40.0
    s.avalia(l, T0) // bloqueia por setpoint com 2,0 °C
    l.temperatura = 5.0
    l.setpoint = 5.0 // a temperatura sobe durante a trava
    for (let t = T0 + PASSO; t < T0 + TRAVA_MS; t += PASSO) s.avalia(l, t)
    l.liberacao = true
    const d = s.avalia(l, T0 + TRAVA_MS) // a subida antiga já é história
    expect(d.estado).toBe(ESTADOS.NORMAL)
    expect(s.ctx.bloqueado).toBe(false)
    expect(s.ctx.bloqueios).toBe(1)
  })
})

describe('teste_liberacao_ordem_ainda_invalida (R28)', () => {
  it('liberar com a ordem ainda inválida reabre o bloqueio e recomeça a trava', () => {
    const s = sessao()
    bloquearPorSetpoint(s) // setpoint 40
    const l = base()
    l.setpoint = 40.0
    l.liberacao = true
    const d = s.avalia(l, T0 + TRAVA_MS)
    expect(d.estado === ESTADOS.BLOQUEIO && d.motivo === MOTIVOS.SETPOINT_INVALIDO).toBe(true)
    expect(d.novoBloqueio).toBe(true)
    expect(s.ctx.bloqueios).toBe(2)
    expect(d.travaRestanteMs).toBe(TRAVA_MS) // a trava recomeça
  })
})

describe('opcoes.travaMs (emulador, D6)', () => {
  it('com trava de 10 s o botão libera em 10 s e é recusado em 8 s', () => {
    const s = sessao({ travaMs: 10000 })
    bloquearPorSetpoint(s)
    const l = base()
    l.liberacao = true
    let d = s.avalia(l, T0 + 8000)
    expect(d.liberacaoRecusada && d.bloqueado && d.travaRestanteMs === 2000).toBe(true)
    d = s.avalia(l, T0 + 10000)
    expect(d.liberou && !d.bloqueado).toBe(true)
  })
})

describe('teste_reles_por_estado (R5, R17, R18)', () => {
  const montar = {
    NORMAL: (s, l) => s.avalia(l, T0),
    ATENCAO: (s, l) => {
      l.luzPct = 80.0
      return s.avalia(l, T0)
    },
    FALHA_SENSOR: (s, l) => {
      l.valida = false
      s.avalia(l, T0)
      return s.avalia(l, T0 + PASSO)
    },
    BLOQUEIO: (s, l) => {
      l.setpoint = 40.0
      return s.avalia(l, T0)
    },
    CRITICO: (s, l) => {
      l.temperatura = 12.0
      s.avalia(l, T0)
      return s.avalia(l, T0 + PASSO)
    },
  }
  for (const alvo of Object.keys(montar)) {
    it(`${alvo}: relés só atuam em BLOQUEIO e CRITICO`, () => {
      const d = montar[alvo](sessao(), base())
      expect(d.estado).toBe(alvo)
      const atua = alvo === ESTADOS.BLOQUEIO || alvo === ESTADOS.CRITICO
      expect(d.cortaAquecedor).toBe(atua)
      expect(d.ligaVentoinha).toBe(atua)
    })
  }
})

describe('teste_nomes (R34)', () => {
  it('nomes canônicos de estado e motivo', () => {
    expect(ESTADOS.NORMAL).toBe('NORMAL')
    expect(ESTADOS.ATENCAO).toBe('ATENCAO')
    expect(ESTADOS.BLOQUEIO).toBe('BLOQUEIO')
    expect(ESTADOS.CRITICO).toBe('CRITICO')
    expect(ESTADOS.FALHA_SENSOR).toBe('FALHA_SENSOR')
    expect(MOTIVOS.NENHUM).toBe('-')
    expect(MOTIVOS.SETPOINT_INVALIDO).toBe('SETPOINT_INVALIDO')
    expect(Object.values(MOTIVOS)).toEqual([
      '-',
      'PORTA_ABERTA',
      'DERIVA',
      'SETPOINT_INVALIDO',
      'DEGELO_FORA_HORARIO',
      'DEGELO_LONGO',
      'AQUECIMENTO_RAPIDO',
      'RESFRIAMENTO_RAPIDO',
      'TEMP_FORA_TOLERANCIA',
      'SENSOR_SEM_LEITURA',
    ])
  })
})

describe('teste_alarme_ate_regularizar (R50, R51)', () => {
  it('bloqueio com temperatura boa: aviso inicial, depois silêncio, bloqueio fica', () => {
    const s = sessao()
    const t = bloquearPorSetpoint(s) // bloqueio com a temperatura boa (5 °C)
    const l = base()
    let d = s.avalia(l, t + PASSO)
    expect(d.bloqueado && d.alarme).toBe(true) // aviso inicial, mesmo com temperatura boa
    d = s.avalia(l, t + ALARME_INICIAL_MS + PASSO)
    expect(d.bloqueado && !d.alarme).toBe(true)

    l.temperatura = 8.5 // acima da faixa: o alarme volta
    d = s.avalia(l, t + ALARME_INICIAL_MS + 2 * PASSO)
    expect(d.bloqueado && d.alarme).toBe(true)
    l.temperatura = 5.0 // regularizou: silêncio, bloqueio fica
    d = s.avalia(l, t + ALARME_INICIAL_MS + 3 * PASSO)
    expect(d.bloqueado && !d.alarme && d.estado === ESTADOS.BLOQUEIO).toBe(true)
    d = s.avalia(l, t + 2 * 3600 * 1000) // horas depois, sem botão
    expect(d.bloqueado && !d.alarme).toBe(true)
  })
  it('CRITICO: alarme até voltar à faixa', () => {
    const c2 = sessao()
    let u = bloquearPorSetpoint(c2) + ALARME_INICIAL_MS + PASSO
    const q = base()
    q.temperatura = 12.0
    c2.avalia(q, (u += PASSO))
    let d = c2.avalia(q, (u += PASSO))
    expect(d.estado === ESTADOS.CRITICO && d.alarme && d.bloqueado).toBe(true)
    q.temperatura = 5.0
    d = c2.avalia(q, u + PASSO)
    expect(d.estado === ESTADOS.BLOQUEIO && !d.alarme && d.bloqueado).toBe(true)
  })
  it('sem leitura não dá para saber: alarme', () => {
    const c3 = sessao()
    let v = bloquearPorSetpoint(c3) + ALARME_INICIAL_MS + PASSO
    const cega = base()
    cega.valida = false
    c3.avalia(cega, (v += PASSO))
    const d = c3.avalia(cega, v + PASSO)
    expect(d.bloqueado && d.alarme).toBe(true)
  })
  it('sem bloqueio nem crítico: nunca alarme (deriva é só ATENCAO)', () => {
    const c4 = sessao()
    let d = c4.avalia(base(), T0)
    expect(!d.bloqueado && !d.alarme).toBe(true)
    const quente = base()
    quente.temperatura = 8.5
    c4.avalia(quente, T0 + PASSO)
    d = c4.avalia(quente, T0 + 2 * PASSO)
    expect(d.estado === ESTADOS.ATENCAO && !d.alarme).toBe(true)
  })
  it('liberar apaga o bloqueio e o alarme', () => {
    const c5 = sessao()
    const w = bloquearPorSetpoint(c5)
    const lib = base()
    lib.liberacao = true
    const d = c5.avalia(lib, w + TRAVA_MS)
    expect(d.liberou && !d.bloqueado && !d.alarme).toBe(true)
  })
})

describe('teste_ataque_frio: alarme (R52 a R54)', () => {
  it('toca fora da faixa e para ao regularizar, com o bloqueio mantido', () => {
    const s = sessao()
    const l = base()
    l.setpoint = 0.0
    s.avalia(l, T0)
    l.temperatura = 0.5
    let d = s.avalia(l, T0 + ALARME_INICIAL_MS + PASSO)
    expect(d.alarme && d.bloqueado).toBe(true)
    l.temperatura = 5.0
    d = s.avalia(l, T0 + ALARME_INICIAL_MS + 2 * PASSO)
    expect(!d.alarme && d.bloqueado).toBe(true)
  })
})

describe('imutabilidade do contexto', () => {
  it('avaliar não muta o contexto de entrada', () => {
    const entrada = criarContexto()
    const copia = structuredClone(entrada)
    const l = base()
    l.setpoint = 40.0
    const { contexto } = avaliar(l, entrada, T0)
    expect(entrada).toEqual(copia)
    expect(contexto).not.toBe(entrada)
    expect(contexto.bloqueado).toBe(true)
  })
  it('o mesmo contexto avaliado duas vezes dá o mesmo resultado', () => {
    const entrada = criarContexto()
    const a = avaliar(base(), entrada, T0)
    const b = avaliar(base(), entrada, T0)
    expect(a).toEqual(b)
  })
})
