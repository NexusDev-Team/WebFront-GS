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
import { CULTURA, SOBRE_GS, VISAO } from '../src/content/nexusDev.js'

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

describe('textos da página', () => {
  it('tem visão, cultura e sobre a GS', () => {
    expect(VISAO.length).toBeGreaterThan(40)
    expect(CULTURA.length).toBeGreaterThanOrEqual(3)
    for (const c of CULTURA) {
      expect(c.titulo).toBeTruthy()
      expect(c.texto.length).toBeGreaterThan(30)
    }
    expect(SOBRE_GS.length).toBeGreaterThanOrEqual(2)
    expect(SOBRE_GS.join(' ')).toMatch(/CitizenTech/)
  })
  it('nunca sugere que o C-Shield recebe comandos pela rede (W43)', () => {
    const tudo = [VISAO, ...CULTURA.map((c) => c.texto), ...SOBRE_GS].join(' ').toLowerCase()
    expect(tudo).not.toMatch(/recebe (comandos|ordens)|comandar (o )?c-shield/)
  })
})
