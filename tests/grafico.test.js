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
import { escalarGrafico } from '../src/domain/grafico.js'

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
