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

// Regras do cadastro "câmara fria do seu bairro" (o CRUD em API externa): validação, payload,
// rótulos e filtro por tipo.
import { describe, expect, it } from 'vitest'
import { ROTULOS_TIPO, TIPOS, casaComTipo, novaCamara, validarCamara } from '../src/domain/camaras.js'

const ok = { nome: 'Padaria da Dona Rosa', bairro: 'Mooca', tipo: 'CONGELADO', observacao: 'Freezer de 2 portas' }

describe('TIPOS e rótulos', () => {
  it('são os 4 tipos de câmara do emulador, cada um com rótulo em português simples', () => {
    expect(TIPOS).toEqual(['VACINA', 'PLASMA', 'INSULINA', 'CONGELADO'])
    for (const t of TIPOS) expect(ROTULOS_TIPO[t]).toBeTruthy()
    expect(ROTULOS_TIPO.PLASMA).toBe('Sangue e plasma')
  })
})

describe('validarCamara', () => {
  it('formulário certo não tem erros, e a observação é opcional', () => {
    expect(validarCamara(ok)).toEqual({})
    expect(validarCamara({ ...ok, observacao: '' })).toEqual({})
    expect(validarCamara({ nome: 'Farmácia', bairro: 'Sé', tipo: 'INSULINA' })).toEqual({})
  })
  it('nome e bairro precisam ter de 2 a 60 letras', () => {
    expect(validarCamara({ ...ok, nome: '' }).nome).toBeTruthy()
    expect(validarCamara({ ...ok, nome: ' a ' }).nome).toBeTruthy()
    expect(validarCamara({ ...ok, nome: 'x'.repeat(61) }).nome).toBeTruthy()
    expect(validarCamara({ ...ok, bairro: '' }).bairro).toBeTruthy()
    expect(validarCamara({ ...ok, bairro: 'x'.repeat(61) }).bairro).toBeTruthy()
    expect(validarCamara({ ...ok, nome: 'ab', bairro: 'cd' })).toEqual({})
  })
  it('o tipo precisa ser um dos 4', () => {
    expect(validarCamara({ ...ok, tipo: '' }).tipo).toBeTruthy()
    expect(validarCamara({ ...ok, tipo: 'SORVETE' }).tipo).toBeTruthy()
  })
  it('a observação tem no máximo 200 letras', () => {
    expect(validarCamara({ ...ok, observacao: 'o'.repeat(200) })).toEqual({})
    expect(validarCamara({ ...ok, observacao: 'o'.repeat(201) }).observacao).toBeTruthy()
  })
})

describe('novaCamara', () => {
  it('monta o registro com textos aparados e a data do cadastro', () => {
    expect(novaCamara({ nome: '  Padaria  ', bairro: ' Mooca ', tipo: 'CONGELADO', observacao: ' ok ' }, '2026-11-12T10:00:00.000Z')).toEqual({
      nome: 'Padaria',
      bairro: 'Mooca',
      tipo: 'CONGELADO',
      observacao: 'ok',
      cadastradoEm: '2026-11-12T10:00:00.000Z',
    })
  })
  it('observação ausente vira texto vazio', () => {
    expect(novaCamara({ nome: 'A1', bairro: 'B1', tipo: 'VACINA' }, '2026-11-12T10:00:00.000Z').observacao).toBe('')
  })
})

describe('casaComTipo', () => {
  it('filtro vazio deixa tudo passar; com tipo, só o tipo igual', () => {
    expect(casaComTipo({ tipo: 'VACINA' }, '')).toBe(true)
    expect(casaComTipo({ tipo: 'VACINA' }, undefined)).toBe(true)
    expect(casaComTipo({ tipo: 'VACINA' }, 'VACINA')).toBe(true)
    expect(casaComTipo({ tipo: 'VACINA' }, 'PLASMA')).toBe(false)
  })
})
