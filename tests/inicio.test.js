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
import { BANNER, CHAMADA, DEMO, PAINEL, PROBLEMA, SOLUCAO, fonteDoFato } from '../src/content/inicio.js'
import { PERFIS_FIRMWARE } from '../src/domain/perfis.js'

const TEXTOS = JSON.stringify({ BANNER, PROBLEMA, SOLUCAO })

describe('BANNER', () => {
  it('tem título, texto, duas ações e a imagem com texto alternativo', () => {
    expect(BANNER.rotulo).toBe('Tecnologia. Segurança. Controle.')
    expect(BANNER.tituloLinha1).toBe('Proteção inteligente')
    expect(BANNER.tituloLinha2).toBe('para a saúde da cidade')
    expect(BANNER.texto).toBe('O C-Shield atua onde ninguém mais consegue.')
    expect(BANNER.acaoPrincipal.para).toBe('/emulador')
    expect(BANNER.acaoSecundaria.para).toBe('/como-funciona')
    expect(BANNER.imagem.src).toMatch(/imghero/)
    expect(BANNER.imagem.alt.length).toBeGreaterThan(15)
  })
})

describe('PROBLEMA', () => {
  it('o título fala em refrigeração', () => {
    expect(PROBLEMA.titulo).toBe('Invadiram a refrigeração pela internet')
  })
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
  it('o título é a frase da ação e o texto explica que o aparelho só envia dados pela rede', () => {
    expect(SOLUCAO.titulo).toBe('C-Shield não espera ninguém. Ele age.')
    expect(SOLUCAO.texto).toMatch(/só envia dados/)
  })
  it('tem quatro passos, na ordem medir, decidir, assumir e alertar e bloquear', () => {
    expect(SOLUCAO.passos.map((p) => p.verbo)).toEqual(['Medir', 'Decidir', 'Assumir', 'Alertar e bloquear'])
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

describe('PAINEL (o painel do C-Shield da página inicial)', () => {
  it('tem título, subtítulo e as partes: alertas, variação e histórico', () => {
    expect(PAINEL.titulo).toBe('Painel do C-Shield')
    for (const parte of ['alertas', 'variacao', 'historico']) {
      expect(PAINEL[parte], parte).toBeDefined()
    }
  })
  it('o subtítulo diz que nada ali manda ordens ao aparelho', () => {
    expect(PAINEL.subtitulo).toMatch(/Nada aqui manda ordens/)
  })
  it('os relés são só indicadores: cada um tem nome e estado em texto, e a nota diz quem os muda', () => {
    expect(PAINEL.historico.reles).toHaveLength(2)
    for (const rele of PAINEL.historico.reles) {
      expect(rele.nome.length, rele.nome).toBeGreaterThan(5)
      expect(rele.estado.length, rele.nome).toBeGreaterThan(3)
      expect(typeof rele.ligado, rele.nome).toBe('boolean')
    }
    expect(PAINEL.historico.nota).toMatch(/só mudam pelo próprio C-Shield/)
  })
  it('nenhum texto sugere controle remoto, automação ou comandos pela rede (W43)', () => {
    expect(JSON.stringify(PAINEL)).not.toMatch(/automa[cç]|controle t[eé]rmico|comando|liga(r)? o|desliga(r)? o/i)
  })
  it('os valores de alerta são identificados como da demonstração', () => {
    expect(PAINEL.alertas.aviso).toMatch(/demonstra/i)
  })
})

describe('CHAMADA (a faixa final da página inicial)', () => {
  it('compara os 3h30 da Europa com os segundos do C-Shield', () => {
    expect(CHAMADA.texto).toBe('Na Europa, foram 3h30 até alguém perceber. Com o C-Shield, segundos.')
  })
  it('leva ao emulador', () => {
    expect(CHAMADA.acao).toEqual({ rotulo: 'Simular um ataque', para: '/emulador' })
  })
  it('o número da chamada é o mesmo do primeiro fato do problema', () => {
    expect(CHAMADA.texto).toContain(PROBLEMA.fatos[0].valor)
  })
})
