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

// Regras do incidente: conjuntos válidos, rótulos em português simples, validação e payload manual.
import { describe, expect, it } from 'vitest'
import {
  MOTIVOS_BLOQUEIO,
  ROTULOS,
  STATUS,
  TIPOS,
  novoIncidenteManual,
  validarEdicao,
  validarIncidente,
} from '../src/domain/incidentes.js'

const valido = () => ({
  localNome: 'Câmara da padaria',
  bairro: 'Pinheiros',
  tipo: 'CALOR',
  motivo: 'SETPOINT_INVALIDO',
  inicio: '2026-11-11T14:30',
  tempoReacaoS: '3',
  exposicao: '0,5',
  status: 'ABERTO',
  acaoTomada: '',
})

describe('conjuntos e rótulos', () => {
  it('status e tipos são os do contrato', () => {
    expect(STATUS).toEqual(['ABERTO', 'EM_ANALISE', 'RESOLVIDO'])
    expect(TIPOS).toEqual(['CALOR', 'FRIO'])
  })
  it('os motivos de bloqueio são os canônicos do Edge', () => {
    expect(MOTIVOS_BLOQUEIO).toEqual([
      'SETPOINT_INVALIDO',
      'DEGELO_FORA_HORARIO',
      'DEGELO_LONGO',
      'AQUECIMENTO_RAPIDO',
      'RESFRIAMENTO_RAPIDO',
      'TEMP_FORA_TOLERANCIA',
    ])
  })
  it('todo valor tem rótulo em português simples', () => {
    for (const s of STATUS) expect(ROTULOS.status[s]).toBeTruthy()
    for (const t of TIPOS) expect(ROTULOS.tipo[t]).toBeTruthy()
    for (const m of MOTIVOS_BLOQUEIO) expect(ROTULOS.motivo[m]).toBeTruthy()
    expect(ROTULOS.status.EM_ANALISE).toBe('Em análise')
    expect(ROTULOS.motivo.SETPOINT_INVALIDO).toBe('Ordem de temperatura perigosa')
    expect(ROTULOS.motivo.AQUECIMENTO_RAPIDO).toBe('Esquentou rápido demais')
    expect(ROTULOS.origem).toEqual({ emulador: 'Emulador', manual: 'Manual' })
  })
})

describe('validarIncidente', () => {
  it('formulário completo não tem erros', () => {
    expect(validarIncidente(valido())).toEqual({})
  })
  it('exige nome e bairro de 2 a 60 caracteres', () => {
    expect(validarIncidente({ ...valido(), localNome: '' }).localNome).toBeTruthy()
    expect(validarIncidente({ ...valido(), localNome: ' a ' }).localNome).toBeTruthy()
    expect(validarIncidente({ ...valido(), bairro: 'x'.repeat(61) }).bairro).toBeTruthy()
    expect(validarIncidente({ ...valido(), bairro: '' }).bairro).toBeTruthy()
  })
  it('tipo, motivo e status precisam estar nos conjuntos', () => {
    expect(validarIncidente({ ...valido(), tipo: 'RAIO' }).tipo).toBeTruthy()
    expect(validarIncidente({ ...valido(), tipo: '' }).tipo).toBeTruthy()
    expect(validarIncidente({ ...valido(), motivo: 'PORTA_ABERTA' }).motivo).toBeTruthy()
    expect(validarIncidente({ ...valido(), status: 'X' }).status).toBeTruthy()
  })
  it('início precisa ser uma data válida', () => {
    expect(validarIncidente({ ...valido(), inicio: '' }).inicio).toBeTruthy()
    expect(validarIncidente({ ...valido(), inicio: 'ontem' }).inicio).toBeTruthy()
  })
  it('reação e exposição aceitam vazio, zero e decimais, mas não negativos ou texto', () => {
    expect(validarIncidente({ ...valido(), tempoReacaoS: '', exposicao: '' })).toEqual({})
    expect(validarIncidente({ ...valido(), tempoReacaoS: '0', exposicao: '1,5' })).toEqual({})
    expect(validarIncidente({ ...valido(), tempoReacaoS: '-1' }).tempoReacaoS).toBeTruthy()
    expect(validarIncidente({ ...valido(), exposicao: 'muito' }).exposicao).toBeTruthy()
  })
  it('ação tomada tem no máximo 300 caracteres', () => {
    expect(validarIncidente({ ...valido(), acaoTomada: 'a'.repeat(300) })).toEqual({})
    expect(validarIncidente({ ...valido(), acaoTomada: 'a'.repeat(301) }).acaoTomada).toBeTruthy()
  })
  it('resolvido exige a ação tomada', () => {
    expect(validarIncidente({ ...valido(), status: 'RESOLVIDO', acaoTomada: '  ' }).acaoTomada).toBeTruthy()
    expect(validarIncidente({ ...valido(), status: 'RESOLVIDO', acaoTomada: 'Lote enviado' })).toEqual({})
  })
})

describe('validarEdicao', () => {
  it('só olha status e ação tomada', () => {
    expect(validarEdicao({ status: 'EM_ANALISE', acaoTomada: '' })).toEqual({})
    expect(validarEdicao({ status: 'X', acaoTomada: '' }).status).toBeTruthy()
    expect(validarEdicao({ status: 'RESOLVIDO', acaoTomada: '' }).acaoTomada).toBeTruthy()
    expect(validarEdicao({ status: 'ABERTO', acaoTomada: 'a'.repeat(301) }).acaoTomada).toBeTruthy()
  })
})

describe('novoIncidenteManual', () => {
  it('monta o payload completo com origem manual', () => {
    expect(novoIncidenteManual(valido())).toEqual({
      origem: 'manual',
      localId: 'manual',
      localNome: 'Câmara da padaria',
      bairro: 'Pinheiros',
      tipo: 'CALOR',
      motivo: 'SETPOINT_INVALIDO',
      inicio: '2026-11-11T14:30',
      tempoReacaoS: 3,
      exposicao: 0.5,
      status: 'ABERTO',
      acaoTomada: '',
    })
  })
  it('apara os textos, zera o que está vazio e usa os padrões', () => {
    const p = novoIncidenteManual({
      ...valido(),
      localNome: '  Mercado  ',
      bairro: ' Mooca ',
      tempoReacaoS: '',
      exposicao: undefined,
      status: undefined,
      acaoTomada: undefined,
    })
    expect(p.localNome).toBe('Mercado')
    expect(p.bairro).toBe('Mooca')
    expect(p.tempoReacaoS).toBe(0)
    expect(p.exposicao).toBe(0)
    expect(p.status).toBe('ABERTO')
    expect(p.acaoTomada).toBe('')
  })
})
