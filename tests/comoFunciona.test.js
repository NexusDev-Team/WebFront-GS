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
// estados e a explicação dos LEDs do Wokwi (a página ficou enxuta: sem a origem da ideia). Os estados e as
// cores de LED são conferidos contra o próprio domínio, para a página não divergir do firmware.
import { describe, expect, it } from 'vitest'
import {
  ARQUITETURA,
  CABECALHO,
  CICLO,
  ESTADOS_DA_PAGINA,
  WOKWI,
} from '../src/content/comoFunciona.js'
import { URL_REPOSITORIO_EDGE, URL_WOKWI } from '../src/content/links.js'
import { corLed } from '../src/domain/cshield-saida.js'
import { ESTADOS } from '../src/domain/nomes.js'
import { BORDAO } from '../src/domain/produto.js'

const TUDO = JSON.stringify({ CABECALHO, CICLO, ARQUITETURA, ESTADOS_DA_PAGINA, WOKWI })

describe('links', () => {
  it('o Wokwi e o repositório do Edge são links https do projeto', () => {
    expect(URL_WOKWI).toBe('https://wokwi.com/projects/480328417992209409')
    expect(URL_REPOSITORIO_EDGE).toBe('https://github.com/NexusDev-Team/C-Shield-Edge')
  })
})

describe('CABECALHO', () => {
  it('tem rótulo, título com destaque (a 2ª linha em ciano) e a frase do produto', () => {
    expect(CABECALHO.rotulo).toBe('O dispositivo')
    expect(CABECALHO.titulo).toBe('Como o C-Shield')
    expect(CABECALHO.destaque).toBe('protege dos ataques')
    expect(CABECALHO.subtitulo).toBe(BORDAO)
    expect(BORDAO).toBe('Alarmes avisam. O C-Shield age.')
  })
})

describe('CICLO (os quatro verbos)', () => {
  it('são medir, decidir, assumir e alertar e bloquear, numerados de 01 a 04, com ícone conhecido', () => {
    expect(CICLO.passos.map((p) => p.verbo)).toEqual(['Medir', 'Decidir', 'Assumir', 'Alertar e bloquear'])
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
  it('alertar e bloquear diz que o bloqueio só termina só termina no botão físico do aparelho', () => {
    const alertar = CICLO.passos.find((p) => p.verbo === 'Alertar e bloquear')
    expect(alertar.texto).toMatch(/bloqueio/)
    expect(alertar.texto).toMatch(/botão físico/)
    expect(alertar.texto).not.toMatch(/3 segundos/)
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

describe('ARQUITETURA: o limite do protótipo', () => {
  it('diz com honestidade que a direção única vem do software e que o diodo físico fica no roadmap', () => {
    expect(ARQUITETURA.limite).toMatch(/software/)
    expect(ARQUITETURA.limite).toMatch(/diodo/)
    expect(ARQUITETURA.limite).toMatch(/roadmap/)
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
  it('cada estado diz só o nome e quando acontece (a lista é compacta, uma linha por estado)', () => {
    for (const estado of ESTADOS_DA_PAGINA) {
      expect(estado.nome.length, estado.id).toBeGreaterThan(3)
      expect(estado.quando.length, estado.id).toBeGreaterThan(20)
      expect(estado, estado.id).not.toHaveProperty('acao')
    }
  })
})

describe('WOKWI (os LEDs e a chave são representações)', () => {
  it('explica em um texto curto o que os LEDs laranja, azul e verde e a chave "Controlador" representam', () => {
    expect(WOKWI.texto).toMatch(/LEDs laranja, azul e verde/)
    expect(WOKWI.texto).toMatch(/chave "Controlador"/)
    for (const equipamento of ['aquecedor', 'ventoinha de emergência', 'refrigeração', 'ordem do atacante']) {
      expect(WOKWI.texto, equipamento).toContain(equipamento)
    }
  })
  it('diz que no aparelho real esses LEDs e essa chave não existem', () => {
    expect(WOKWI.texto).toMatch(/não existem/)
  })
  it('é curto: não há mais os cartões de cada peça nem a nota separada', () => {
    expect(WOKWI).not.toHaveProperty('representacoes')
    expect(WOKWI).not.toHaveProperty('nota')
    expect(WOKWI.texto.length).toBeLessThan(400)
  })
  it('os links externos são o Wokwi e o repositório do Edge', () => {
    expect(WOKWI.links.map((l) => l.url)).toEqual([URL_WOKWI, URL_REPOSITORIO_EDGE])
  })
})

describe('a página não tem mais a origem da ideia (cortada em 13/11)', () => {
  it('o conteúdo não exporta ORIGEM', async () => {
    const conteudo = await import('../src/content/comoFunciona.js')
    expect(conteudo).not.toHaveProperty('ORIGEM')
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
