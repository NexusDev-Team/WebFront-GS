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

// Conteúdo da página Nexus Dev: os 5 integrantes (nomes e RMs conferidos) e os textos da equipe.
import { describe, expect, it } from 'vitest'
import { EQUIPE, iniciaisDe } from '../src/content/equipe.js'
import { PROPOSITO } from '../src/content/nexusDev.js'

describe('EQUIPE', () => {
  it('são os 5 integrantes, na ordem do cabeçalho do grupo, com os RMs certos', () => {
    expect(EQUIPE.map((m) => [m.nome, m.rm])).toEqual([
      ['Isac Nilton Fernandes de Oliveira', 'RM573282'],
      ['João Benedito de Oliveira Simplício', 'RM570206'],
      ['Leonardo Formigari', 'RM573291'],
      ['Luis Fernando', 'RM570959'],
      ['Nicolas Cinel', 'RM572940'],
    ])
  })
  it('cada um tem função, foto em /equipe/ e iniciais', () => {
    for (const m of EQUIPE) {
      expect(m.funcao, m.nome).toBeTruthy()
      expect(m.foto, m.nome).toMatch(/^\/equipe\/[a-z-]+\.jpg$/)
      expect(m.iniciais, m.nome).toMatch(/^[A-Z]{2}$/)
    }
    expect(new Set(EQUIPE.map((m) => m.foto)).size).toBe(5)
  })
  it('iniciaisDe usa a primeira letra do primeiro e do último nome', () => {
    expect(iniciaisDe('Isac Nilton Fernandes de Oliveira')).toBe('IO')
    expect(iniciaisDe('João Benedito de Oliveira Simplício')).toBe('JS')
    expect(iniciaisDe('Nicolas Cinel')).toBe('NC')
    expect(iniciaisDe('Luis Fernando')).toBe('LF')
  })
})

describe('textos da página (uma tela: equipe e propósito, sem visão nem cultura)', () => {
  it('o propósito é o texto escrito pela equipe em 14/11', () => {
    expect(PROPOSITO.startsWith('Acreditamos que a tecnologia deve proteger tanto quanto ela transforma.')).toBe(true)
    expect(PROPOSITO).toContain('bem-estar coletivo')
    expect(PROPOSITO).toContain('confiar na tecnologia que as cerca')
  })
  it('a seção "Sobre a GS" foi cortada em 13/11 e a visão e a cultura em 14/11', async () => {
    const conteudo = await import('../src/content/nexusDev.js')
    expect(conteudo.SOBRE_GS).toBeUndefined()
    expect(conteudo.VISAO).toBeUndefined()
    expect(conteudo.CULTURA).toBeUndefined()
  })
  it('nunca sugere que o C-Shield recebe comandos pela rede (W43)', () => {
    expect(PROPOSITO.toLowerCase()).not.toMatch(/recebe (comandos|ordens)|comandar (o )?c-shield/)
  })
})
