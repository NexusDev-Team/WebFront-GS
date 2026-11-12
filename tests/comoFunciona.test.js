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


// Conteúdo da página Como funciona (W44, W26c): o ciclo, a arquitetura em uma direção, os cinco
// estados, as faixas seguras, a explicação dos LEDs do Wokwi e a origem da ideia. Os estados e as
// cores de LED são conferidos contra o próprio domínio, para a página não divergir do firmware.
import { describe, expect, it } from 'vitest'
import {
  ARQUITETURA,
  CABECALHO,
  CICLO,
  ESTADOS_DA_PAGINA,
  FAIXAS,
  ORIGEM,
  WOKWI,
} from '../src/content/comoFunciona.js'
import { URL_REPOSITORIO_EDGE, URL_WOKWI } from '../src/content/links.js'
import { corLed } from '../src/domain/cshield-saida.js'
import { ESTADOS } from '../src/domain/nomes.js'
import { PERFIS_FIRMWARE } from '../src/domain/perfis.js'

const TUDO = JSON.stringify({ CABECALHO, CICLO, ARQUITETURA, ESTADOS_DA_PAGINA, FAIXAS, WOKWI, ORIGEM })

describe('links', () => {
  it('o Wokwi e o repositório do Edge são links https do projeto', () => {
    expect(URL_WOKWI).toBe('https://wokwi.com/projects/480328417992209409')
    expect(URL_REPOSITORIO_EDGE).toBe('https://github.com/NexusDev-Team/C-Shield-Edge')
  })
})

describe('CABECALHO', () => {
  it('tem rótulo, título e a frase do produto', () => {
    expect(CABECALHO.rotulo).toBe('O dispositivo')
    expect(CABECALHO.titulo).toBe('Como o C-Shield funciona')
    expect(CABECALHO.subtitulo).toBe('Vê de longe. Só obedece de perto.')
  })
})

describe('CICLO (os quatro verbos)', () => {
  it('são medir, decidir, assumir e alertar, numerados de 01 a 04, com ícone conhecido', () => {
    expect(CICLO.passos.map((p) => p.verbo)).toEqual(['Medir', 'Decidir', 'Assumir', 'Alertar'])
    expect(CICLO.passos.map((p) => p.numero)).toEqual(['01', '02', '03', '04'])
    for (const passo of CICLO.passos) {
      expect(['termometro', 'escudo', 'rele', 'sino'], passo.verbo).toContain(passo.icone)
      expect(passo.texto.length, passo.verbo).toBeGreaterThan(80)
    }
  })
  it('assumir explica as duas direções do ataque (calor e frio)', () => {
    const assumir = CICLO.passos.find((p) => p.verbo === 'Assumir')
    expect(assumir.texto).toMatch(/calor/i)
    expect(assumir.texto).toMatch(/frio/i)
  })
  it('alertar diz que o bloqueio só termina com o botão do aparelho, segurado por 3 segundos', () => {
    const alertar = CICLO.passos.find((p) => p.verbo === 'Alertar')
    expect(alertar.texto).toMatch(/3 segundos/)
  })
})

describe('ARQUITETURA (uma direção só)', () => {
  it('tem texto alternativo do diagrama e a lista de etapas equivalente', () => {
    expect(ARQUITETURA.descricao.length).toBeGreaterThan(80)
    expect(ARQUITETURA.etapas).toHaveLength(6)
  })
  it('diz que o C-Shield não escuta a rede e que só envia dados', () => {
    const etapas = ARQUITETURA.etapas.join(' ')
    expect(etapas).toMatch(/não escuta a rede/)
    expect(etapas).toMatch(/só envia dados/)
  })
})

describe('ESTADOS_DA_PAGINA (os cinco estados)', () => {
  it('são os cinco nomes canônicos do Edge, na ordem do contrato', () => {
    expect(ESTADOS_DA_PAGINA.map((e) => e.id)).toEqual([
      ESTADOS.NORMAL,
      ESTADOS.ATENCAO,
      ESTADOS.BLOQUEIO,
      ESTADOS.CRITICO,
      ESTADOS.FALHA_SENSOR,
    ])
  })
  it('a cor do LED de cada estado é a mesma que o domínio calcula (azul fixo no bloqueio)', () => {
    for (const estado of ESTADOS_DA_PAGINA) {
      const decisao = { estado: estado.id, bloqueado: estado.id === ESTADOS.BLOQUEIO }
      expect(estado.led, estado.id).toBe(corLed(decisao))
    }
    expect(ESTADOS_DA_PAGINA.find((e) => e.id === ESTADOS.BLOQUEIO).led).toBe('azul')
  })
  it('cada estado diz quando acontece e o que o aparelho faz', () => {
    for (const estado of ESTADOS_DA_PAGINA) {
      expect(estado.nome.length, estado.id).toBeGreaterThan(3)
      expect(estado.quando.length, estado.id).toBeGreaterThan(20)
      expect(estado.acao.length, estado.id).toBeGreaterThan(20)
    }
  })
})

describe('FAIXAS (faixas seguras)', () => {
  it('há um exemplo real para cada perfil do firmware, e a etiqueta "gravada no dispositivo"', () => {
    expect(Object.keys(FAIXAS.exemplos).sort()).toEqual(Object.keys(PERFIS_FIRMWARE).sort())
    expect(FAIXAS.etiqueta).toBe('gravada no dispositivo')
    expect(FAIXAS.id).toBe('faixas')
  })
})

describe('WOKWI (os LEDs e a chave são representações)', () => {
  it('explica as quatro peças: LED laranja, azul, verde e a chave do controlador', () => {
    expect(WOKWI.representacoes.map((r) => r.peca)).toEqual(['LED laranja', 'LED azul', 'LED verde', 'Chave "Controlador"'])
    for (const r of WOKWI.representacoes) {
      expect(r.representa.length, r.peca).toBeGreaterThan(10)
      expect(r.comportamento.length, r.peca).toBeGreaterThan(20)
    }
  })
  it('diz que no aparelho real esses LEDs e essa chave não existem', () => {
    expect(WOKWI.nota).toMatch(/não existem/)
  })
  it('os links externos são o Wokwi e o repositório do Edge', () => {
    expect(WOKWI.links.map((l) => l.url)).toEqual([URL_WOKWI, URL_REPOSITORIO_EDGE])
  })
})

describe('ORIGEM (de onde vem a ideia)', () => {
  it('cita a norma IEC 61511 e os diodos de dados', () => {
    const texto = ORIGEM.itens.map((i) => i.texto).join(' ')
    expect(texto).toMatch(/IEC 61511/)
    expect(texto).toMatch(/diodos de dados/)
  })
  it('é honesta sobre o limite do protótipo e leva à página da equipe', () => {
    expect(ORIGEM.limite.texto).toMatch(/software/)
    expect(ORIGEM.limite.texto).toMatch(/roadmap/)
    expect(ORIGEM.link.para).toBe('/nexus-dev')
  })
})

describe('regra do produto em todos os textos (W43)', () => {
  it('nenhum texto diz que o C-Shield aceita comandos pela rede', () => {
    expect(TUDO).not.toMatch(/aceita (comandos|ordens)|recebe (comandos|ordens) pela rede|pode receber/i)
  })
  it('não usa leet fora do emulador', () => {
    expect(TUDO).not.toMatch(/4T4QU3|C4L0R|FR10/i)
  })
})
