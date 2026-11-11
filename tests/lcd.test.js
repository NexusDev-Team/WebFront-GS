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

// Telas do LCD 16x2, conferidas contra os textos de edge/cshield/painel.h.
import { describe, expect, it } from 'vitest'
import { ALTERNA_TELA_MS, TRAVA_MS } from '../src/domain/config.js'
import { ESTADOS, MOTIVOS } from '../src/domain/cshield.js'
import {
  telaBoot,
  telaEstado,
  telaLiberado,
  telaLiberando,
  telaSemBloqueio,
  telaTrava,
} from '../src/domain/lcd.js'
import { PERFIS_FIRMWARE } from '../src/domain/perfis.js'
import { PASSO, T0, base, bloquearPorSetpoint, sessao } from './helpers.js'

const VACINA = PERFIS_FIRMWARE.VACINA

// Decisão mínima para os casos em que só o estado, o motivo e a trava importam.
function dec(estado, motivo = MOTIVOS.NENHUM, extra = {}) {
  return { estado, motivo, bloqueado: false, travaRestanteMs: 0, exposicao: 0, ...extra }
}
// Linha 2 em cada fase da alternância (0, 2 s, 4 s...).
function linha2(d, l, fase) {
  return telaEstado(d, l, fase * ALTERNA_TELA_MS, VACINA)[1]
}

describe('telaEstado: linha 1', () => {
  it('"Estado: <nome>" com os nomes do LCD', () => {
    const l = base()
    expect(telaEstado(dec(ESTADOS.NORMAL), l, 0, VACINA)[0]).toBe('Estado: Ideal')
    expect(telaEstado(dec(ESTADOS.ATENCAO, MOTIVOS.PORTA_ABERTA), l, 0, VACINA)[0]).toBe('Estado: Atencao')
    expect(telaEstado(dec(ESTADOS.BLOQUEIO, MOTIVOS.SETPOINT_INVALIDO), l, 0, VACINA)[0]).toBe('Estado: Bloqueio')
    expect(telaEstado(dec(ESTADOS.CRITICO), l, 0, VACINA)[0]).toBe('Estado: Critico')
    expect(telaEstado(dec(ESTADOS.FALHA_SENSOR), l, 0, VACINA)[0]).toBe('Estado: Falha')
  })
})

describe('telaEstado: linha 2', () => {
  it('NORMAL mostra só a temperatura, com o símbolo de grau', () => {
    const l = base()
    expect(linha2(dec(ESTADOS.NORMAL), l, 0)).toBe('Temp: 5.0°C')
    expect(linha2(dec(ESTADOS.NORMAL), l, 1)).toBe('Temp: 5.0°C')
  })
  it('sem leitura e sem mensagem do estado mostra "Lendo sensor..."', () => {
    const l = base()
    l.valida = false
    expect(linha2(dec(ESTADOS.NORMAL), l, 0)).toBe('Lendo sensor...')
  })
  it('ATENCAO alterna a temperatura com o motivo a cada 2 s', () => {
    const l = base()
    const porta = dec(ESTADOS.ATENCAO, MOTIVOS.PORTA_ABERTA)
    expect(linha2(porta, l, 0)).toBe('Temp: 5.0°C')
    expect(linha2(porta, l, 1)).toBe('Porta aberta')
    expect(linha2(porta, l, 2)).toBe('Temp: 5.0°C')
    const deriva = dec(ESTADOS.ATENCAO, MOTIVOS.DERIVA)
    expect(linha2(deriva, l, 1)).toBe('Temp fora faixa')
  })
  it('a alternância troca na fronteira exata de ALTERNA_TELA_MS', () => {
    const l = base()
    const porta = dec(ESTADOS.ATENCAO, MOTIVOS.PORTA_ABERTA)
    expect(telaEstado(porta, l, ALTERNA_TELA_MS - 1, VACINA)[1]).toBe('Temp: 5.0°C')
    expect(telaEstado(porta, l, ALTERNA_TELA_MS, VACINA)[1]).toBe('Porta aberta')
  })
  it('BLOQUEIO com temperatura boa: motivo e contagem da liberação', () => {
    const l = base()
    const d = dec(ESTADOS.BLOQUEIO, MOTIVOS.SETPOINT_INVALIDO, { bloqueado: true, travaRestanteMs: TRAVA_MS })
    expect(linha2(d, l, 0)).toBe('Temp: 5.0°C')
    expect(linha2(d, l, 1)).toBe('Alt. de Setpoint')
    expect(linha2(d, l, 2)).toBe('Liberacao em 60s')
    expect(linha2(d, l, 3)).toBe('Temp: 5.0°C')
  })
  it('BLOQUEIO com temperatura fora da faixa inclui "Restaurando temp"', () => {
    const l = base()
    l.temperatura = 9.5
    const d = dec(ESTADOS.BLOQUEIO, MOTIVOS.SETPOINT_INVALIDO, { bloqueado: true, travaRestanteMs: 30000 })
    expect(linha2(d, l, 2)).toBe('Restaurando temp')
    expect(linha2(d, l, 3)).toBe('Liberacao em 30s')
  })
  it('depois da trava pede para segurar o botão por 3 s', () => {
    const d = dec(ESTADOS.BLOQUEIO, MOTIVOS.SETPOINT_INVALIDO, { bloqueado: true, travaRestanteMs: 0 })
    expect(linha2(d, base(), 2)).toBe('Segure botao 3s')
  })
  it('trava longa (uso real) mostra minutos', () => {
    const d = dec(ESTADOS.BLOQUEIO, MOTIVOS.SETPOINT_INVALIDO, { bloqueado: true, travaRestanteMs: 30 * 60000 })
    expect(linha2(d, base(), 2)).toBe('Liberacao em 30m')
    const d99 = { ...d, travaRestanteMs: 99000 }
    expect(linha2(d99, base(), 2)).toBe('Liberacao em 99s')
    const d100 = { ...d, travaRestanteMs: 100000 }
    expect(linha2(d100, base(), 2)).toBe('Liberacao em 1m')
  })
  it('um texto por motivo de bloqueio', () => {
    const esperado = {
      [MOTIVOS.SETPOINT_INVALIDO]: 'Alt. de Setpoint',
      [MOTIVOS.DEGELO_FORA_HORARIO]: 'Degelo fora hora',
      [MOTIVOS.DEGELO_LONGO]: 'Degelo longo',
      [MOTIVOS.AQUECIMENTO_RAPIDO]: 'Aquec. rapido',
      [MOTIVOS.RESFRIAMENTO_RAPIDO]: 'Resfria rapido',
      [MOTIVOS.TEMP_FORA_TOLERANCIA]: 'Bloqueio ativo',
    }
    for (const [motivo, texto] of Object.entries(esperado)) {
      const d = dec(ESTADOS.BLOQUEIO, motivo, { bloqueado: true, travaRestanteMs: 5000 })
      expect(linha2(d, base(), 1)).toBe(texto)
    }
  })
  it('CRITICO mostra a exposição e, se bloqueado, "Bloqueio ativo"', () => {
    const l = base()
    const livre = dec(ESTADOS.CRITICO, MOTIVOS.TEMP_FORA_TOLERANCIA, { exposicao: 1.234 })
    expect(linha2(livre, l, 1)).toBe('Exposicao 1.2')
    const preso = dec(ESTADOS.CRITICO, MOTIVOS.SETPOINT_INVALIDO, { bloqueado: true, exposicao: 0 })
    expect(linha2(preso, l, 1)).toBe('Bloqueio ativo')
    expect(linha2(preso, l, 2)).toBe('Exposicao 0.0')
  })
  it('FALHA_SENSOR mostra "Sensor sem dado"', () => {
    const l = base()
    l.valida = false
    expect(linha2(dec(ESTADOS.FALHA_SENSOR, MOTIVOS.SENSOR_SEM_LEITURA), l, 0)).toBe('Sensor sem dado')
  })
  it('funciona com decisões reais vindas de avaliar()', () => {
    const s = sessao()
    bloquearPorSetpoint(s)
    const d = s.avalia(base(), T0 + PASSO)
    expect(telaEstado(d, base(), 2 * ALTERNA_TELA_MS, VACINA)).toEqual(['Estado: Bloqueio', 'Liberacao em 58s'])
  })
  it('nunca passa de 16 colunas', () => {
    const l = base()
    l.temperatura = 9.5
    for (const estado of Object.values(ESTADOS)) {
      for (const motivo of Object.values(MOTIVOS)) {
        for (const travaRestanteMs of [0, 5000, 59000, 99000, 1800000]) {
          const d = dec(estado, motivo, { bloqueado: true, travaRestanteMs, exposicao: 12.34 })
          for (let fase = 0; fase < 5; fase++) {
            for (const linha of telaEstado(d, l, fase * ALTERNA_TELA_MS, VACINA)) {
              expect(linha.length).toBeLessThanOrEqual(16)
            }
          }
        }
      }
    }
  })
})

describe('telas especiais', () => {
  it('telaTrava avisa quanto falta', () => {
    expect(telaTrava(45000)).toEqual(['Trava ativa', 'Aguarde 45s'])
    expect(telaTrava(30 * 60000)).toEqual(['Trava ativa', 'Aguarde 30m'])
  })
  it('telaLiberado e telaSemBloqueio', () => {
    expect(telaLiberado()).toEqual(['Estado: Liberado', 'Controle normal'])
    expect(telaSemBloqueio()).toEqual(['Sem bloqueio', 'Nada a liberar'])
  })
  it('telaLiberando enche uma barra de 16 blocos', () => {
    expect(telaLiberando(0)).toEqual(['Liberando...', ''])
    expect(telaLiberando(50)[1]).toBe('█'.repeat(8))
    expect(telaLiberando(100)[1]).toBe('█'.repeat(16))
    expect(telaLiberando(100)[1]).toHaveLength(16)
  })
  it('telaBoot usa o nome do produto', () => {
    expect(telaBoot()).toEqual(['C-Shield', 'Iniciando...'])
  })
})
