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

// Lógica pura da chuva de binários do fundo: criar colunas, avançá-las no tempo e dar o brilho de
// cada dígito do rastro. Sem DOM; o sorteio entra por parâmetro para o teste ser determinístico.
import { describe, expect, it } from 'vitest'
import { alfaDoRastro, avancarColunas, criarColunas } from '../src/components/ui/chuvaBinaria.js'

// Sorteio determinístico: devolve a sequência dada, repetindo-a.
function sequencia(...valores) {
  let i = 0
  return () => valores[i++ % valores.length]
}

describe('criarColunas', () => {
  it('cria uma coluna por faixa de espaço, só nas posições sorteadas pela densidade', () => {
    const todas = criarColunas(280, { espaco: 28, densidade: 1, aleatorio: sequencia(0.5) })
    expect(todas).toHaveLength(10)
    const nenhuma = criarColunas(280, { espaco: 28, densidade: 0, aleatorio: sequencia(0.5) })
    expect(nenhuma).toHaveLength(0)
  })

  it('põe x em múltiplos do espaço e usa só os dígitos 0 e 1', () => {
    const colunas = criarColunas(560, { espaco: 28, densidade: 1, aleatorio: Math.random })
    for (const c of colunas) {
      expect(c.x % 28).toBe(0)
      expect(c.digitos.length).toBe(c.comprimento)
      expect(c.digitos.every((d) => d === '0' || d === '1')).toBe(true)
    }
  })

  it('sorteia velocidade entre 25 e 60 px/s e começa acima do topo', () => {
    const baixa = criarColunas(28, { espaco: 28, densidade: 1, aleatorio: sequencia(0) })
    const alta = criarColunas(28, { espaco: 28, densidade: 1, aleatorio: sequencia(0.999) })
    expect(baixa[0].velocidade).toBeGreaterThanOrEqual(25)
    expect(alta[0].velocidade).toBeLessThanOrEqual(60)
    expect(baixa[0].y).toBeLessThanOrEqual(0)
  })
})

describe('avancarColunas', () => {
  const base = [{ x: 0, y: 10, velocidade: 40, comprimento: 6, digitos: ['0', '1', '0', '1', '0', '1'] }]

  it('desce em proporção ao tempo e não muda a lista de entrada', () => {
    const novas = avancarColunas(base, 500, 800, sequencia(0.5))
    expect(novas[0].y).toBeCloseTo(10 + 40 * 0.5)
    expect(base[0].y).toBe(10)
    expect(novas).not.toBe(base)
  })

  it('recomeça acima do topo, com novos dígitos, quando passa da altura', () => {
    const fim = [{ ...base[0], y: 790 }]
    const novas = avancarColunas(fim, 1000, 800, sequencia(0.1))
    expect(novas[0].y).toBeLessThan(0)
    expect(novas[0].digitos).toHaveLength(novas[0].comprimento)
  })
})

describe('alfaDoRastro', () => {
  it('a cabeça brilha (1) e a cauda apaga até perto de 0', () => {
    const comprimento = 10
    expect(alfaDoRastro(comprimento - 1, comprimento)).toBe(1)
    expect(alfaDoRastro(0, comprimento)).toBeLessThan(0.15)
    for (let i = 1; i < comprimento; i++) {
      expect(alfaDoRastro(i, comprimento)).toBeGreaterThan(alfaDoRastro(i - 1, comprimento))
    }
  })
})
