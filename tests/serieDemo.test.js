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


// Série simulada de um sensor (a demonstração da página inicial): cada leitura sai de uma função
// pura do índice, então a mesma configuração sempre gera a mesma série e ela pode continuar de
// onde parou. O ruído vem de um hash do índice, nunca de Math.random.
import { describe, expect, it } from 'vitest'
import { amplitudeDaSerie, proximaLeitura, serieSensor } from '../src/domain/serieDemo.js'

// Câmara de congelados da demonstração: perto de -19,2 °C, variando até 1,2 °C para cada lado.
const CONGELADOS = { base: -19.2, amplitude: 1.2, semente: 7 }

describe('serieSensor', () => {
  it('gera n leituras com índices seguidos a partir de "inicio"', () => {
    const serie = serieSensor({ inicio: 10, n: 24, ...CONGELADOS })
    expect(serie).toHaveLength(24)
    expect(serie.map((p) => p.indice)).toEqual(Array.from({ length: 24 }, (_, i) => 10 + i))
  })
  it('a mesma configuração gera sempre a mesma série', () => {
    expect(serieSensor({ inicio: 0, n: 30, ...CONGELADOS })).toEqual(serieSensor({ inicio: 0, n: 30, ...CONGELADOS }))
  })
  it('sementes diferentes geram séries diferentes', () => {
    const a = serieSensor({ inicio: 0, n: 30, ...CONGELADOS })
    const b = serieSensor({ inicio: 0, n: 30, ...CONGELADOS, semente: 8 })
    expect(a).not.toEqual(b)
  })
  it('todas as leituras ficam em base ± amplitude e, nos congelados, dentro da faixa segura (≤ -18 °C)', () => {
    const serie = serieSensor({ inicio: 0, n: 500, ...CONGELADOS })
    for (const { temperatura } of serie) {
      expect(temperatura).toBeLessThanOrEqual(-18)
      expect(temperatura).toBeGreaterThanOrEqual(-30)
      expect(Math.abs(temperatura - CONGELADOS.base)).toBeLessThanOrEqual(CONGELADOS.amplitude + 0.05)
    }
  })
  it('as leituras têm uma casa decimal', () => {
    for (const { temperatura } of serieSensor({ inicio: 0, n: 50, ...CONGELADOS })) {
      expect(Math.round(temperatura * 10) / 10).toBe(temperatura)
    }
  })
  it('a série varia de verdade (não é uma reta)', () => {
    const temps = serieSensor({ inicio: 0, n: 60, ...CONGELADOS }).map((p) => p.temperatura)
    expect(Math.max(...temps) - Math.min(...temps)).toBeGreaterThan(0.5)
  })
})

describe('proximaLeitura', () => {
  it('continua a série: é a leitura que viria logo depois da última', () => {
    const serie = serieSensor({ inicio: 0, n: 5, ...CONGELADOS })
    const completa = serieSensor({ inicio: 0, n: 6, ...CONGELADOS })
    expect(proximaLeitura(serie, CONGELADOS)).toEqual(completa[5])
  })
})

describe('amplitudeDaSerie', () => {
  it('é metade da diferença entre a maior e a menor leitura', () => {
    expect(amplitudeDaSerie([{ temperatura: -20 }, { temperatura: -18 }, { temperatura: -19 }])).toBe(1)
  })
  it('com menos de 2 leituras é zero', () => {
    expect(amplitudeDaSerie([])).toBe(0)
    expect(amplitudeDaSerie([{ temperatura: -19 }])).toBe(0)
  })
})
