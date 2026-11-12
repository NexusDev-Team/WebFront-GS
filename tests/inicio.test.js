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

// Conteúdo da página inicial: banner, problema (três números com fonte) e solução (quatro passos).
import { describe, expect, it } from 'vitest'
import { BANNER, DEMO, PROBLEMA, SOLUCAO, fonteDoFato } from '../src/content/inicio.js'
import { PERFIS_FIRMWARE } from '../src/domain/perfis.js'

const TEXTOS = JSON.stringify({ BANNER, PROBLEMA, SOLUCAO })

describe('BANNER', () => {
  it('tem título, texto, duas ações e a imagem com texto alternativo', () => {
    expect(BANNER.rotulo).toBe('Cadeia do frio e gestão térmica')
    expect(BANNER.titulo).toBe('Proteção inteligente para a cadeia de frio')
    expect(BANNER.texto).toBe('Às 2h da manhã, o C-Shield atua onde ninguém mais consegue.')
    expect(BANNER.texto.length).toBeGreaterThan(40)
    expect(BANNER.acaoPrincipal.para).toBe('/emulador')
    expect(BANNER.acaoSecundaria.para).toBe('/como-funciona')
    expect(BANNER.imagem.src).toMatch(/^\/imagens\//)
    expect(BANNER.imagem.alt.length).toBeGreaterThan(15)
  })
})

describe('PROBLEMA', () => {
  it('tem três fatos, cada um com número, explicação e uma notícia de fonte com link https', () => {
    expect(PROBLEMA.fatos).toHaveLength(3)
    for (const fato of PROBLEMA.fatos) {
      expect(fato.valor, fato.fonteId).toBeTruthy()
      expect(fato.rotulo.length, fato.fonteId).toBeGreaterThan(20)
      const fonte = fonteDoFato(fato)
      expect(fonte, fato.fonteId).toBeDefined()
      expect(fonte.url, fato.fonteId).toMatch(/^https:\/\//)
      expect(fonte.veiculo, fato.fonteId).toBeTruthy()
    }
  })
  it('os números são os do caso: 3h30, 12.976 e 110 °C', () => {
    expect(PROBLEMA.fatos.map((f) => f.valor)).toEqual(['3h30', '12.976', '110 °C'])
  })
  it('as fontes são três notícias diferentes', () => {
    expect(new Set(PROBLEMA.fatos.map((f) => f.fonteId)).size).toBe(3)
  })
  it('leva para a página de notícias', () => {
    expect(PROBLEMA.link.para).toBe('/noticias')
  })
})

describe('SOLUCAO', () => {
  it('tem quatro passos, na ordem medir, decidir, assumir e alertar', () => {
    expect(SOLUCAO.passos.map((p) => p.verbo)).toEqual(['Medir', 'Decidir', 'Assumir', 'Alertar'])
    expect(SOLUCAO.passos.map((p) => p.numero)).toEqual(['01', '02', '03', '04'])
  })
  it('cada passo tem texto e um ícone conhecido', () => {
    for (const passo of SOLUCAO.passos) {
      expect(passo.texto.length, passo.verbo).toBeGreaterThan(30)
      expect(['termometro', 'escudo', 'rele', 'sino'], passo.verbo).toContain(passo.icone)
    }
  })
  it('leva para a página Como funciona', () => {
    expect(SOLUCAO.link.para).toBe('/como-funciona')
  })
})

describe('textos da página inicial', () => {
  it('não usam leet: o leet fica só no emulador', () => {
    expect(TEXTOS).not.toMatch(/4T4QU3|C4L0R|FR10/i)
  })
  it('nunca dizem que o C-Shield recebe comandos pela rede (W43)', () => {
    expect(TEXTOS).not.toMatch(/recebe (comandos|ordens) pela rede(?!\.)/i)
    expect(SOLUCAO.texto).toMatch(/nenhum comando pela rede/i)
  })
})

describe('DEMO (a câmara simulada da demonstração)', () => {
  it('usa um perfil que existe no firmware e uma série curta o bastante para o gráfico', () => {
    expect(PERFIS_FIRMWARE[DEMO.perfil]).toBeDefined()
    expect(DEMO.n).toBeGreaterThanOrEqual(12)
    expect(DEMO.n).toBeLessThanOrEqual(40)
  })
  it('a variação cabe inteira na faixa segura do perfil, para o estado "estabilizado" ser verdadeiro', () => {
    const { tMin, tMax } = PERFIS_FIRMWARE[DEMO.perfil]
    expect(DEMO.base + DEMO.amplitude).toBeLessThanOrEqual(tMax)
    expect(DEMO.base - DEMO.amplitude).toBeGreaterThanOrEqual(tMin)
  })
  it('tem um título para o cartão de leitura', () => {
    expect(DEMO.titulo.length).toBeGreaterThan(5)
  })
})
