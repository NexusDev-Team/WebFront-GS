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

// Domínio da cidade do emulador: 5 locais, ataques, proteção e o fluxo completo do jogo.
import { describe, expect, it } from 'vitest'
import { LOCAIS, criarCidade } from '../src/domain/cidade.js'
import { PERFIS_EMULADOR } from '../src/domain/perfis.js'

describe('LOCAIS', () => {
  it('são 5, com id, nome, bairro, perfil e posição dentro do mapa 1000×600', () => {
    expect(LOCAIS).toHaveLength(5)
    expect(LOCAIS.map((l) => l.id)).toEqual([
      'ubs-vila-mariana',
      'ubs-brasilandia',
      'hemocentro-consolacao',
      'farmacia-mooca',
      'mercado-liberdade',
    ])
    for (const l of LOCAIS) {
      expect(l.nome).toBeTruthy()
      expect(l.bairro).toBeTruthy()
      expect(PERFIS_EMULADOR[l.perfil]).toBeDefined()
      expect(l.x).toBeGreaterThan(0)
      expect(l.x).toBeLessThan(1000)
      expect(l.y).toBeGreaterThan(0)
      expect(l.y).toBeLessThan(600)
    }
  })
  it('usa os perfis certos: vacina, vacina, plasma, insulina, congelado', () => {
    expect(LOCAIS.map((l) => l.perfil)).toEqual(['VACINA', 'VACINA', 'PLASMA', 'INSULINA', 'CONGELADO'])
  })
})

describe('criarCidade', () => {
  it('começa calma: relógio zerado, nada atacado, sem coordenado', () => {
    const c = criarCidade()
    expect(c.relogioSimMs).toBe(0)
    expect(c.ataquesRecentes).toEqual([])
    expect(c.coordenado).toBeNull()
    expect(Object.keys(c.locais)).toHaveLength(5)
  })
  it('só a UBS Vila Mariana nasce protegida', () => {
    const c = criarCidade()
    const protegidos = Object.entries(c.locais).filter(([, l]) => l.protegido).map(([id]) => id)
    expect(protegidos).toEqual(['ubs-vila-mariana'])
  })
  it('cada local começa no alvo do seu perfil, sem ordem de ataque e sem exposição', () => {
    const c = criarCidade()
    for (const def of LOCAIS) {
      const l = c.locais[def.id]
      expect(l.temperatura).toBe(PERFIS_EMULADOR[def.perfil].tAlvo)
      expect(l.ordem).toBe('NORMAL')
      expect(l.exposicao).toBe(0)
      expect(l.decisao).toBeNull()
      expect(l.refrigeracaoLigada).toBe(true)
      expect(l.historico).toEqual([])
    }
  })
  it('cada chamada devolve uma cidade independente', () => {
    const a = criarCidade()
    a.locais['farmacia-mooca'].temperatura = 99
    expect(criarCidade().locais['farmacia-mooca'].temperatura).toBe(PERFIS_EMULADOR.INSULINA.tAlvo)
  })
})
