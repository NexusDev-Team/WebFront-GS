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

// Conteúdo da página Notícias: estrutura das matérias e da linha do tempo.
import { describe, expect, it } from 'vitest'
import { LINHA_DO_TEMPO } from '../src/content/linhaDoTempo.js'
import { NOTICIAS, noticiaDestaque, noticiasOrdenadas } from '../src/content/noticias.js'

describe('NOTICIAS', () => {
  it('tem várias matérias, com ids únicos', () => {
    expect(NOTICIAS.length).toBeGreaterThanOrEqual(6)
    expect(new Set(NOTICIAS.map((n) => n.id)).size).toBe(NOTICIAS.length)
  })
  it('cada matéria tem veículo, idioma, data, manchete, resumo e link https', () => {
    for (const n of NOTICIAS) {
      expect(n.veiculo, n.id).toBeTruthy()
      expect(['pt', 'en'], n.id).toContain(n.idioma)
      expect(n.data, n.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(n.data)), n.id).toBe(false)
      expect(n.manchete.length, n.id).toBeGreaterThan(10)
      expect(n.manchete.length, n.id).toBeLessThanOrEqual(140)
      expect(n.resumo.length, n.id).toBeGreaterThan(40)
      expect(n.url, n.id).toMatch(/^https:\/\//)
      expect(typeof n.manchetePublicada, n.id).toBe('boolean')
    }
  })
  it('as datas ficam no período do caso (agosto a novembro de 2026)', () => {
    for (const n of NOTICIAS) {
      expect(n.data >= '2026-08-01' && n.data <= '2026-11-30', n.id).toBe(true)
    }
  })
  it('tem exatamente uma notícia em destaque, e ela é em português', () => {
    expect(NOTICIAS.filter((n) => n.destaque)).toHaveLength(1)
    expect(noticiaDestaque().idioma).toBe('pt')
  })
  it('noticiasOrdenadas põe a mais recente primeiro, sem o destaque', () => {
    const lista = noticiasOrdenadas()
    expect(lista).toHaveLength(NOTICIAS.length - 1)
    expect(lista.find((n) => n.destaque)).toBeUndefined()
    for (let i = 1; i < lista.length; i++) expect(lista[i - 1].data >= lista[i].data).toBe(true)
  })
  it('só mostra como citação o título que foi conferido na fonte', () => {
    const conferidas = NOTICIAS.filter((n) => n.manchetePublicada)
    expect(conferidas.length).toBeGreaterThanOrEqual(5)
  })
})

describe('LINHA_DO_TEMPO', () => {
  it('em ordem cronológica, terminando com o C-Shield', () => {
    expect(LINHA_DO_TEMPO.length).toBeGreaterThanOrEqual(5)
    const ataques = LINHA_DO_TEMPO.filter((e) => e.tipo !== 'cshield')
    for (let i = 1; i < ataques.length; i++) expect(ataques[i - 1].data <= ataques[i].data).toBe(true)
    expect(LINHA_DO_TEMPO.at(-1).tipo).toBe('cshield')
  })
  it('cada evento tem data, rótulo de data, título, texto e tipo válido', () => {
    for (const e of LINHA_DO_TEMPO) {
      expect(e.data).toMatch(/^\d{4}-\d{2}(-\d{2})?$/)
      expect(e.quando).toBeTruthy()
      expect(e.titulo).toBeTruthy()
      expect(e.texto.length).toBeGreaterThan(20)
      expect(['ataque', 'alerta', 'cshield']).toContain(e.tipo)
    }
  })
  it('traz o número das 3h30 até alguém perceber', () => {
    expect(LINHA_DO_TEMPO.some((e) => /3h30/.test(e.titulo + e.texto))).toBe(true)
  })
})
