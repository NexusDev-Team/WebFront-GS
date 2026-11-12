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
import { caminhoArea, caminhoSuave, escalarGrafico, escalarSerie } from '../src/domain/grafico.js'

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

describe('escalarSerie (gráfico de área da página inicial)', () => {
  const GEO = { largura: 400, altura: 200 }
  const TEMPS = [-19.4, -18.8, -19.9, -18.3, -19.1, -20.0]

  it('devolve um ponto por leitura, do começo ao fim da área', () => {
    const g = escalarSerie(TEMPS, GEO)
    expect(g.pontos).toHaveLength(TEMPS.length)
    expect(g.pontos[0].x).toBeCloseTo(g.area.x, 5)
    expect(g.pontos[TEMPS.length - 1].x).toBeCloseTo(g.area.x + g.area.largura, 5)
  })
  it('temperatura maior fica mais acima (y menor) e tudo cabe na área', () => {
    const g = escalarSerie(TEMPS, GEO)
    const maior = TEMPS.indexOf(Math.max(...TEMPS))
    const menor = TEMPS.indexOf(Math.min(...TEMPS))
    expect(g.pontos[maior].y).toBeLessThan(g.pontos[menor].y)
    for (const { y } of g.pontos) {
      expect(y).toBeGreaterThanOrEqual(g.area.y)
      expect(y).toBeLessThanOrEqual(g.area.y + g.area.altura)
    }
  })
  it('as marcas do eixo cobrem a série, em passos iguais e redondos', () => {
    const g = escalarSerie(TEMPS, GEO)
    const valores = g.marcas.map((m) => m.valor)
    expect(Math.min(...valores)).toBeLessThanOrEqual(Math.min(...TEMPS))
    expect(Math.max(...valores)).toBeGreaterThanOrEqual(Math.max(...TEMPS))
    const passos = valores.slice(1).map((v, i) => +(v - valores[i]).toFixed(6))
    expect(new Set(passos).size).toBe(1)
    expect([0.5, 1, 2, 5, 10]).toContain(passos[0])
    expect(g.marcas.length).toBeGreaterThanOrEqual(3)
    expect(g.marcas.length).toBeLessThanOrEqual(6)
  })
  it('a linha de limite entra na escala', () => {
    const g = escalarSerie(TEMPS, GEO, { limite: -15 })
    expect(Math.max(...g.marcas.map((m) => m.valor))).toBeGreaterThanOrEqual(-15)
    expect(g.yDe(-15)).toBeGreaterThanOrEqual(g.area.y)
    expect(g.yDe(-15)).toBeLessThan(g.pontos[0].y)
  })
  it('a base do gráfico fica embaixo da área', () => {
    const g = escalarSerie(TEMPS, GEO)
    expect(g.baseY).toBeCloseTo(g.area.y + g.area.altura, 5)
  })
  it('série constante e série de um ponto só não geram NaN', () => {
    for (const temps of [[-19, -19, -19], [-19]]) {
      const g = escalarSerie(temps, GEO)
      expect(JSON.stringify(g)).not.toMatch(/NaN|Infinity|null/)
      expect(g.marcas.length).toBeGreaterThanOrEqual(2)
    }
  })
})
