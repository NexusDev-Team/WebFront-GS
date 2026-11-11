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

// Palavras simples do emulador: rótulo de cada situação e o anúncio das mudanças.
import { describe, expect, it } from 'vitest'
import { LOCAIS } from '../src/domain/cidade.js'
import { ROTULO_SITUACAO, anunciarMudancas } from '../src/components/emulador/rotulos.js'

const NOMES = Object.fromEntries(LOCAIS.map((l) => [l.id, l.nome]))
const normal = () => Object.fromEntries(LOCAIS.map((l) => [l.id, 'NORMAL']))

describe('ROTULO_SITUACAO', () => {
  it('uma palavra simples para cada situação', () => {
    expect(ROTULO_SITUACAO).toEqual({
      NORMAL: 'Normal',
      SOB_ATAQUE: 'Sob ataque',
      ATAQUE_BLOQUEADO: 'Ataque bloqueado',
      SEGURO: 'Seguro',
      SEGURO_LOTE_EM_ANALISE: 'Seguro · lote em análise',
    })
  })
})

describe('anunciarMudancas', () => {
  it('sem mudança não anuncia nada', () => {
    expect(anunciarMudancas(normal(), normal(), NOMES)).toBe('')
  })
  it('anuncia o local que mudou, com o nome e a situação', () => {
    const depois = { ...normal(), 'ubs-brasilandia': 'SOB_ATAQUE' }
    expect(anunciarMudancas(normal(), depois, NOMES)).toBe('UBS Brasilândia: sob ataque.')
  })
  it('junta várias mudanças numa frase só', () => {
    const depois = { ...normal(), 'ubs-brasilandia': 'SOB_ATAQUE', 'farmacia-mooca': 'SOB_ATAQUE' }
    expect(anunciarMudancas(normal(), depois, NOMES)).toBe('UBS Brasilândia: sob ataque. Farmácia Mooca: sob ataque.')
  })
  it('com 3 ou mais mudanças de uma vez resume', () => {
    const depois = Object.fromEntries(LOCAIS.map((l) => [l.id, 'SOB_ATAQUE']))
    expect(anunciarMudancas(normal(), depois, NOMES)).toBe('5 locais mudaram de situação.')
  })
  it('anuncia bloqueio e segurança', () => {
    const a = { ...normal(), 'ubs-vila-mariana': 'SOB_ATAQUE' }
    const b = { ...normal(), 'ubs-vila-mariana': 'ATAQUE_BLOQUEADO' }
    expect(anunciarMudancas(a, b, NOMES)).toBe('UBS Vila Mariana: ataque bloqueado.')
    const c = { ...normal(), 'ubs-vila-mariana': 'SEGURO_LOTE_EM_ANALISE' }
    expect(anunciarMudancas(b, c, NOMES)).toBe('UBS Vila Mariana: seguro · lote em análise.')
  })
})
