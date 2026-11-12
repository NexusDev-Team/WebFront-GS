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

// Escala do gráfico de temperatura: pontos viram coordenadas, e a faixa segura vira uma região.
import { describe, expect, it } from 'vitest'
import { caminhoArea, caminhoSuave, escalarGrafico } from '../src/domain/grafico.js'

const GEO = { largura: 400, altura: 160 }
const FAIXA = { tMin: 2, tMax: 8 }
const pt = (tSimMin, temperatura) => ({ tSimMin, temperatura })

describe('escalarGrafico', () => {
  it('com menos de 2 pontos não há linha, mas a faixa já existe', () => {
    for (const pontos of [[], [pt(0, 5)]]) {
      const g = escalarGrafico(pontos, FAIXA, GEO)
      expect(g.caminho).toBe('')
      expect(g.faixa.altura).toBeGreaterThan(0)
    }
  })
  it('a linha vai da margem esquerda à direita e fica dentro da área', () => {
    const g = escalarGrafico([pt(0, 5), pt(5, 5), pt(10, 5)], FAIXA, GEO)
    const nums = g.caminho.match(/-?\d+(\.\d+)?/g).map(Number)
    const xs = nums.filter((_, i) => i % 2 === 0)
    const ys = nums.filter((_, i) => i % 2 === 1)
    expect(Math.min(...xs)).toBeCloseTo(g.area.x, 5)
    expect(Math.max(...xs)).toBeCloseTo(g.area.x + g.area.largura, 5)
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(g.area.y)
      expect(y).toBeLessThanOrEqual(g.area.y + g.area.altura)
    }
  })
  it('temperatura constante dentro da faixa fica entre os limites da faixa', () => {
    const g = escalarGrafico([pt(0, 5), pt(10, 5)], FAIXA, GEO)
    const y = Number(g.caminho.match(/-?\d+(\.\d+)?/g)[1])
    expect(y).toBeGreaterThan(g.yTMax)
    expect(y).toBeLessThan(g.yTMin)
  })
  it('mais quente é mais alto na tela (y menor)', () => {
    const g = escalarGrafico([pt(0, 5), pt(10, 12)], FAIXA, GEO)
    const nums = g.caminho.match(/-?\d+(\.\d+)?/g).map(Number)
    expect(nums[3]).toBeLessThan(nums[1])
    expect(nums[3]).toBeLessThan(g.yTMax) // 12 °C passa do máximo da faixa
  })
  it('a escala cresce para caber temperaturas muito fora da faixa', () => {
    const g = escalarGrafico([pt(0, 5), pt(10, 45)], FAIXA, GEO)
    const nums = g.caminho.match(/-?\d+(\.\d+)?/g).map(Number)
    expect(nums[3]).toBeGreaterThanOrEqual(g.area.y)
    expect(g.yTMax).toBeLessThanOrEqual(g.area.y + g.area.altura)
    expect(g.yTMin).toBeLessThanOrEqual(g.area.y + g.area.altura)
  })
  it('a faixa sombreada vai do limite máximo ao mínimo', () => {
    const g = escalarGrafico([pt(0, 5), pt(10, 5)], FAIXA, GEO)
    expect(g.yTMax).toBeLessThan(g.yTMin)
    expect(g.faixa.y).toBeCloseTo(g.yTMax, 5)
    expect(g.faixa.y + g.faixa.altura).toBeCloseTo(g.yTMin, 5)
  })
  it('funciona com faixas negativas (plasma)', () => {
    const g = escalarGrafico([pt(0, -30), pt(10, -20)], { tMin: -40, tMax: -25 }, GEO)
    expect(g.caminho).not.toBe('')
    expect(g.yTMax).toBeLessThan(g.yTMin)
  })
  it('todos os pontos no mesmo instante não quebram a escala', () => {
    const g = escalarGrafico([pt(3, 5), pt(3, 6)], FAIXA, GEO)
    expect(g.caminho).not.toMatch(/NaN|Infinity/)
  })
})

describe('caminhoSuave (curva do gráfico de área)', () => {
  const P = [
    { x: 0, y: 50 },
    { x: 40, y: 30 },
    { x: 80, y: 60 },
    { x: 100, y: 20 },
  ]
  it('com menos de 2 pontos devolve texto vazio', () => {
    expect(caminhoSuave([])).toBe('')
    expect(caminhoSuave([{ x: 1, y: 2 }])).toBe('')
  })
  it('com 2 pontos vira uma linha reta', () => {
    expect(caminhoSuave([{ x: 0, y: 0 }, { x: 10, y: 10 }])).toBe('M 0.0 0.0 L 10.0 10.0')
  })
  it('começa no primeiro ponto e termina no último', () => {
    const d = caminhoSuave(P)
    expect(d.startsWith('M 0.0 50.0')).toBe(true)
    expect(d.endsWith(' 100.0 20.0')).toBe(true)
  })
  it('usa uma curva cúbica por trecho', () => {
    expect(caminhoSuave(P).match(/C/g)).toHaveLength(P.length - 1)
  })
  it('nunca gera NaN nem Infinity, mesmo com pontos repetidos', () => {
    const repetidos = [{ x: 0, y: 5 }, { x: 0, y: 5 }, { x: 0, y: 5 }]
    for (const pontos of [P, repetidos]) {
      expect(caminhoSuave(pontos)).not.toMatch(/NaN|Infinity/)
    }
  })
  it('a curva passa pelos pontos (cada trecho termina num ponto)', () => {
    const d = caminhoSuave(P)
    for (const ponto of P.slice(1)) {
      expect(d).toContain(` ${ponto.x.toFixed(1)} ${ponto.y.toFixed(1)}`)
    }
  })
})

describe('caminhoArea (preenchimento sob a curva)', () => {
  const P = [{ x: 0, y: 50 }, { x: 50, y: 30 }, { x: 100, y: 40 }]
  it('com menos de 2 pontos devolve texto vazio', () => {
    expect(caminhoArea([], 100)).toBe('')
  })
  it('acompanha a curva e fecha pela base, do último ponto de volta ao primeiro', () => {
    const d = caminhoArea(P, 120)
    expect(d.startsWith(caminhoSuave(P))).toBe(true)
    expect(d).toContain('L 100.0 120.0')
    expect(d).toContain('L 0.0 120.0')
    expect(d.endsWith('Z')).toBe(true)
  })
})
