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

// Domínio da cidade do emulador: 5 locais, ataques, proteção e o fluxo completo do jogo.
import { describe, expect, it } from 'vitest'
import {
  ID_PILOTO,
  LOCAIS,
  ataqueEmMassa,
  atacar,
  criarCidade,
  liberar,
  passo,
  pararAtaques,
  recomecar,
} from '../src/domain/cidade.js'
import {
  instalarCShield,
  motivoNaoDesativar,
  podeDesativar,
  removerCShield,
} from '../src/domain/cidade-protecao.js'
import { PERCEPCAO_SEM_CSHIELD_MIN, formatarReacao, placar, situacao } from '../src/domain/cidade-placar.js'
import { PERFIS_EMULADOR } from '../src/domain/perfis.js'

describe('LOCAIS', () => {
  it('são 5, com id, nome, bairro, perfil e posição dentro do mapa 1000×600', () => {
    expect(LOCAIS).toHaveLength(5)
    expect(LOCAIS.map((l) => l.id)).toEqual([
      'ubs-vila-mariana',
      'ubs-brasilandia',
      'hemocentro-consolacao',
      'farmacia-mooca',
      'mercado-liberdade',
    ])
    for (const l of LOCAIS) {
      expect(l.nome).toBeTruthy()
      expect(l.bairro).toBeTruthy()
      expect(PERFIS_EMULADOR[l.perfil]).toBeDefined()
      expect(l.x).toBeGreaterThan(0)
      expect(l.x).toBeLessThan(1000)
      expect(l.y).toBeGreaterThan(0)
      expect(l.y).toBeLessThan(600)
    }
  })
  it('usa os perfis certos: vacina, vacina, plasma, insulina, congelado', () => {
    expect(LOCAIS.map((l) => l.perfil)).toEqual(['VACINA', 'VACINA', 'PLASMA', 'INSULINA', 'CONGELADO'])
  })
})

describe('criarCidade', () => {
  it('começa calma: relógio zerado, nada atacado, sem coordenado', () => {
    const c = criarCidade()
    expect(c.relogioSimMs).toBe(0)
    expect(c.ataquesRecentes).toEqual([])
    expect(c.coordenado).toBeNull()
    expect(Object.keys(c.locais)).toHaveLength(5)
  })
  it('só a UBS Vila Mariana nasce protegida', () => {
    const c = criarCidade()
    const protegidos = Object.entries(c.locais).filter(([, l]) => l.protegido).map(([id]) => id)
    expect(protegidos).toEqual(['ubs-vila-mariana'])
  })
  it('cada local começa no alvo do seu perfil, sem ordem de ataque e sem exposição', () => {
    const c = criarCidade()
    for (const def of LOCAIS) {
      const l = c.locais[def.id]
      expect(l.temperatura).toBe(PERFIS_EMULADOR[def.perfil].tAlvo)
      expect(l.ordem).toBe('NORMAL')
      expect(l.exposicao).toBe(0)
      expect(l.decisao).toBeNull()
      expect(l.refrigeracaoLigada).toBe(true)
      expect(l.historico).toEqual([])
    }
  })
  it('cada chamada devolve uma cidade independente', () => {
    const a = criarCidade()
    a.locais['farmacia-mooca'].temperatura = 99
    expect(criarCidade().locais['farmacia-mooca'].temperatura).toBe(PERFIS_EMULADOR.INSULINA.tAlvo)
  })
})

describe('atacar', () => {
  it('ataque de calor muda só o local atacado', () => {
    const c = atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 1000)
    expect(c.locais['ubs-brasilandia'].ordem).toBe('CALOR')
    expect(c.locais['ubs-brasilandia'].houveAtaque).toBe(true)
    expect(c.locais['ubs-brasilandia'].inicioAtaqueSimMs).toBe(0)
    for (const id of Object.keys(c.locais).filter((i) => i !== 'ubs-brasilandia')) {
      expect(c.locais[id].ordem).toBe('NORMAL')
      expect(c.locais[id].houveAtaque).toBe(false)
    }
  })
  it('ataque de frio manda a ordem FRIO', () => {
    const c = atacar(criarCidade(), 'farmacia-mooca', 'FRIO', 1000)
    expect(c.locais['farmacia-mooca'].ordem).toBe('FRIO')
  })
  it('registra o ataque recente e não muta a cidade recebida', () => {
    const antes = criarCidade()
    const copia = structuredClone(antes)
    const depois = atacar(antes, 'ubs-brasilandia', 'CALOR', 1000)
    expect(antes).toEqual(copia)
    expect(depois.ataquesRecentes).toEqual([{ localId: 'ubs-brasilandia', emRealMs: 1000 }])
  })
  it('recusa local ou tipo que não existem', () => {
    expect(() => atacar(criarCidade(), 'nao-existe', 'CALOR', 0)).toThrow()
    expect(() => atacar(criarCidade(), 'ubs-brasilandia', 'RAIO', 0)).toThrow()
  })
})

describe('ataque coordenado (D8)', () => {
  const ataca = (c, id, t) => atacar(c, id, 'CALOR', t)

  it('dois locais não marcam coordenado', () => {
    let c = ataca(criarCidade(), 'ubs-brasilandia', 0)
    c = ataca(c, 'farmacia-mooca', 3000)
    expect(c.coordenado).toBeNull()
  })
  it('três locais em menos de 20 s reais marcam no terceiro clique', () => {
    let c = ataca(criarCidade(), 'ubs-brasilandia', 0)
    c = ataca(c, 'farmacia-mooca', 4000)
    expect(c.coordenado).toBeNull()
    c = ataca(c, 'mercado-liberdade', 9000)
    expect(c.coordenado).toEqual({ n: 3, segundos: 9 })
  })
  it('três locais espalhados por mais de 20 s não marcam', () => {
    let c = ataca(criarCidade(), 'ubs-brasilandia', 0)
    c = ataca(c, 'farmacia-mooca', 10000)
    c = ataca(c, 'mercado-liberdade', 25000)
    expect(c.coordenado).toBeNull()
  })
  it('atacar o mesmo local várias vezes conta como um só', () => {
    let c = ataca(criarCidade(), 'ubs-brasilandia', 0)
    c = ataca(c, 'ubs-brasilandia', 1000)
    c = ataca(c, 'ubs-brasilandia', 2000)
    expect(c.coordenado).toBeNull()
  })
  it('o quarto local atualiza o número do coordenado', () => {
    let c = ataca(criarCidade(), 'ubs-brasilandia', 0)
    c = ataca(c, 'farmacia-mooca', 1000)
    c = ataca(c, 'mercado-liberdade', 2000)
    c = ataca(c, 'hemocentro-consolacao', 3000)
    expect(c.coordenado).toEqual({ n: 4, segundos: 3 })
  })
  it('a janela de 20 s é contada até o clique atual: 3 cliques dentro de 20 s depois de um antigo', () => {
    let c = ataca(criarCidade(), 'ubs-brasilandia', 0) // fora da janela quando o 3º clique chegar
    c = ataca(c, 'farmacia-mooca', 30000)
    c = ataca(c, 'mercado-liberdade', 35000)
    expect(c.coordenado).toBeNull()
    c = ataca(c, 'hemocentro-consolacao', 40000)
    expect(c.coordenado).toEqual({ n: 3, segundos: 10 })
  })
})

// Avança a cidade como o jogo faria: quadros de 100 ms reais até somar `segundosReais`.
function avancar(cidade, segundosReais, quadroMs = 100) {
  let c = cidade
  for (let ms = 0; ms < segundosReais * 1000; ms += quadroMs) c = passo(c, quadroMs)
  return c
}

describe('passo: relógio', () => {
  it('1 s real vale 1 min simulado, em ciclos de 2 s simulados', () => {
    const c = passo(criarCidade(), 1000)
    expect(c.relogioSimMs).toBe(60000)
    expect(c.restoSimMs).toBe(0)
  })
  it('guarda a fração de ciclo que ainda não deu', () => {
    const c = passo(criarCidade(), 10) // 600 ms simulados: nenhum ciclo completo
    expect(c.relogioSimMs).toBe(0)
    expect(c.restoSimMs).toBe(600)
    const d = passo(c, 25) // +1500 => 2100: um ciclo e sobram 100
    expect(d.relogioSimMs).toBe(2000)
    expect(d.restoSimMs).toBe(100)
  })
  it('não muta a cidade recebida', () => {
    const antes = atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0)
    const copia = structuredClone(antes)
    passo(antes, 500)
    expect(antes).toEqual(copia)
  })
})

describe('passo: câmara sem C-Shield (cidade acelerada)', () => {
  it('sem ataque a temperatura fica no alvo e a exposição em zero', () => {
    const c = avancar(criarCidade(), 5)
    for (const def of LOCAIS) {
      expect(c.locais[def.id].temperatura).toBeCloseTo(PERFIS_EMULADOR[def.perfil].tAlvo, 6)
      expect(c.locais[def.id].exposicao).toBe(0)
    }
  })
  it('ataque de calor tira o local da faixa em cerca de 1 s real', () => {
    const inicial = atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0)
    const tMax = PERFIS_EMULADOR.VACINA.tMax
    expect(avancar(inicial, 0.7).locais['ubs-brasilandia'].temperatura).toBeLessThanOrEqual(tMax)
    expect(avancar(inicial, 1.4).locais['ubs-brasilandia'].temperatura).toBeGreaterThan(tMax)
  })
  it('desprotegido não tem decisão, perde a refrigeração e acumula exposição', () => {
    const c = avancar(atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0), 3)
    const l = c.locais['ubs-brasilandia']
    expect(l.decisao).toBeNull()
    expect(l.refrigeracaoLigada).toBe(false)
    expect(l.exposicao).toBeGreaterThan(0)
  })
  it('o ataque só afeta o local atacado', () => {
    const c = avancar(atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0), 3)
    expect(c.locais['farmacia-mooca'].temperatura).toBeCloseTo(PERFIS_EMULADOR.INSULINA.tAlvo, 6)
    expect(c.locais['farmacia-mooca'].exposicao).toBe(0)
  })
  it('todos os perfis saem da faixa em cerca de 1 s real, no calor e no frio', () => {
    for (const def of LOCAIS.filter((l) => l.id !== 'ubs-vila-mariana')) {
      const p = PERFIS_EMULADOR[def.perfil]
      const quente = avancar(atacar(criarCidade(), def.id, 'CALOR', 0), 1.4).locais[def.id]
      expect(quente.temperatura).toBeGreaterThan(p.tMax)
      const frio = avancar(atacar(criarCidade(), def.id, 'FRIO', 0), 1.4).locais[def.id]
      expect(frio.temperatura).toBeLessThan(p.tMin)
      expect(frio.exposicao).toBe(0) // exposição só conta calor acima do máximo
    }
  })
})

describe('passo: câmara com C-Shield', () => {
  it('bloqueia no primeiro ciclo por SETPOINT_INVALIDO, cortando o aquecedor e ligando a ventoinha', () => {
    const c = passo(atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0), 34) // 1 ciclo
    const l = c.locais['ubs-vila-mariana']
    expect(l.decisao.estado).toBe('BLOQUEIO')
    expect(l.decisao.motivo).toBe('SETPOINT_INVALIDO')
    expect(l.decisao.novoBloqueio).toBe(true)
    expect(l.decisao.cortaAquecedor && l.decisao.ligaVentoinha).toBe(true)
    expect(l.reacaoSimMs).toBeLessThanOrEqual(2000)
    expect(l.reacaoSimMs).toBeGreaterThan(0)
  })
  it('a temperatura continua dentro da faixa durante todo o ataque', () => {
    let c = atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0)
    const p = PERFIS_EMULADOR.VACINA
    for (let i = 0; i < 100; i++) {
      c = passo(c, 100)
      const t = c.locais['ubs-vila-mariana'].temperatura
      expect(t).toBeLessThanOrEqual(p.tMax)
      expect(t).toBeGreaterThanOrEqual(p.tMin)
    }
    expect(c.locais['ubs-vila-mariana'].exposicao).toBe(0)
  })
  it('conta um bloqueio só, mesmo com o ataque continuando', () => {
    const c = avancar(atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0), 5)
    expect(c.locais['ubs-vila-mariana'].contexto.bloqueios).toBe(1)
  })
  it('ataque de frio inverte os relés: aquecedor liberado e ventoinha desligada', () => {
    const c = passo(atacar(criarCidade(), 'ubs-vila-mariana', 'FRIO', 0), 34)
    const d = c.locais['ubs-vila-mariana'].decisao
    expect(d.estado).toBe('BLOQUEIO')
    expect(d.motivo).toBe('SETPOINT_INVALIDO')
    expect(d.cortaAquecedor).toBe(false)
    expect(d.ligaVentoinha).toBe(false)
  })
  it('sem ataque o protegido fica NORMAL', () => {
    const d = avancar(criarCidade(), 3).locais['ubs-vila-mariana'].decisao
    expect(d.estado).toBe('NORMAL')
  })
})

describe('passo: histórico', () => {
  it('guarda pontos { tSimMin, temperatura } e no máximo 120', () => {
    const c = avancar(criarCidade(), 40, 200)
    const h = c.locais['ubs-brasilandia'].historico
    expect(h.length).toBeGreaterThan(10)
    expect(h.length).toBeLessThanOrEqual(120)
    expect(Object.keys(h[0]).sort()).toEqual(['tSimMin', 'temperatura'])
    expect(h[h.length - 1].tSimMin).toBeGreaterThan(h[0].tSimMin)
  })
})

const sit = (c, id) => situacao(c.locais[id])

describe('situacao (W17)', () => {
  it('local sem ataque é NORMAL', () => {
    expect(sit(criarCidade(), 'farmacia-mooca')).toBe('NORMAL')
    expect(sit(avancar(criarCidade(), 2), 'ubs-vila-mariana')).toBe('NORMAL')
  })
  it('local atacado sem C-Shield está SOB_ATAQUE', () => {
    const c = avancar(atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0), 2)
    expect(sit(c, 'ubs-brasilandia')).toBe('SOB_ATAQUE')
  })
  it('local atacado com C-Shield está com o ATAQUE_BLOQUEADO', () => {
    const c = avancar(atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0), 1)
    expect(sit(c, 'ubs-vila-mariana')).toBe('ATAQUE_BLOQUEADO')
  })
})

describe('instalarCShield', () => {
  it('protege só o local escolhido e não muta a cidade recebida', () => {
    const antes = criarCidade()
    const copia = structuredClone(antes)
    const depois = instalarCShield(antes, 'ubs-brasilandia')
    expect(antes).toEqual(copia)
    expect(depois.locais['ubs-brasilandia'].protegido).toBe(true)
    expect(depois.locais['farmacia-mooca'].protegido).toBe(false)
    expect(depois.locais['mercado-liberdade'].protegido).toBe(false)
  })
  it('instalar de novo num local já protegido não muda nada', () => {
    const c = instalarCShield(criarCidade(), 'ubs-brasilandia')
    expect(instalarCShield(c, 'ubs-brasilandia')).toEqual(c)
    expect(instalarCShield(c, ID_PILOTO)).toEqual(c)
  })
  it('recusa local que não existe', () => {
    expect(() => instalarCShield(criarCidade(), 'nao-existe')).toThrow()
  })
  it('um local atacado vira ATAQUE_BLOQUEADO logo depois e a câmara volta à faixa', () => {
    let c = avancar(atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0), 3)
    expect(sit(c, 'ubs-brasilandia')).toBe('SOB_ATAQUE')
    c = instalarCShield(c, 'ubs-brasilandia')
    c = avancar(c, 0.2)
    expect(sit(c, 'ubs-brasilandia')).toBe('ATAQUE_BLOQUEADO')
    expect(c.locais['ubs-brasilandia'].decisao.motivo).toBe('SETPOINT_INVALIDO')
    c = avancar(c, 5)
    expect(c.locais['ubs-brasilandia'].temperatura).toBeLessThanOrEqual(PERFIS_EMULADOR.VACINA.tMax)
    expect(sit(c, 'ubs-brasilandia')).toBe('ATAQUE_BLOQUEADO') // o bloqueio só termina presencialmente
  })
  it('a exposição de antes da proteção não se perde', () => {
    let c = avancar(atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0), 3)
    const antes = c.locais['ubs-brasilandia'].exposicao
    expect(antes).toBeGreaterThan(0)
    c = avancar(instalarCShield(c, 'ubs-brasilandia'), 0.2)
    expect(c.locais['ubs-brasilandia'].exposicao).toBeGreaterThanOrEqual(antes)
  })
  it('a reação conta a partir de quando o C-Shield foi ativado', () => {
    let c = avancar(atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0), 3)
    c = avancar(instalarCShield(c, 'ubs-brasilandia'), 0.2)
    expect(c.locais['ubs-brasilandia'].reacaoSimMs).toBeLessThanOrEqual(2000)
  })
})

describe('liberar (botão de 3 s, trava de 10 s reais)', () => {
  it('antes de 10 s reais é recusado; depois é aceito', () => {
    let c = avancar(atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0), 9)
    c = liberar(c, 'ubs-vila-mariana')
    expect(c.locais['ubs-vila-mariana'].liberacaoRecusada).toBe(true)
    c = avancar(c, 0.5)
    expect(sit(c, 'ubs-vila-mariana')).toBe('ATAQUE_BLOQUEADO')
    c = avancar(c, 1) // passou dos 10 s reais de trava
    c = liberar(c, 'ubs-vila-mariana')
    expect(c.locais['ubs-vila-mariana'].liberacaoRecusada).toBe(false)
    c = passo(c, 34) // um ciclo: o da liberação
    expect(c.locais['ubs-vila-mariana'].decisao.liberou).toBe(true)
    expect(c.locais['ubs-vila-mariana'].decisao.bloqueado).toBe(false)
  })
  it('liberar um local sem bloqueio não faz nada', () => {
    const c = criarCidade()
    expect(liberar(c, 'ubs-vila-mariana')).toEqual(c)
    expect(liberar(c, 'farmacia-mooca')).toEqual(c)
  })
  it('liberar não muta a cidade recebida', () => {
    const c = avancar(atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0), 11)
    const copia = structuredClone(c)
    liberar(c, 'ubs-vila-mariana')
    expect(c).toEqual(copia)
  })
})

describe('fluxo completo do jogo', () => {
  it('local protegido: ataque, bloqueio, liberação e SEGURO sem exposição, em menos de 1 min reais', () => {
    let realMs = 0
    const rodar = (c, s) => {
      realMs += s * 1000
      return avancar(c, s)
    }
    let c = atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0)
    c = rodar(c, 0.5)
    expect(sit(c, 'ubs-vila-mariana')).toBe('ATAQUE_BLOQUEADO')
    c = rodar(c, 10.5) // espera a trava de 10 s reais
    c = liberar(c, 'ubs-vila-mariana')
    c = rodar(c, 0.5)
    expect(sit(c, 'ubs-vila-mariana')).toBe('SEGURO')
    expect(realMs).toBeLessThan(60000)
  })
  it('local que levou o ataque e depois ganhou C-Shield termina SEGURO_LOTE_EM_ANALISE', () => {
    let realMs = 0
    const rodar = (c, s) => {
      realMs += s * 1000
      return avancar(c, s)
    }
    let c = atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0)
    c = rodar(c, 3) // sem proteção a câmara esquenta
    c = instalarCShield(c, 'ubs-brasilandia')
    c = rodar(c, 11) // bloqueia, esfria e espera a trava
    c = liberar(c, 'ubs-brasilandia')
    c = rodar(c, 0.5)
    expect(sit(c, 'ubs-brasilandia')).toBe('SEGURO_LOTE_EM_ANALISE')
    expect(c.locais['ubs-brasilandia'].exposicao).toBeGreaterThan(0)
    expect(realMs).toBeLessThan(60000)
  })
})

describe('ataqueEmMassa', () => {
  it('ataca os 5 locais e marca o coordenado na hora com n = 5', () => {
    const c = ataqueEmMassa(criarCidade(), 'CALOR', 5000)
    for (const def of LOCAIS) {
      expect(c.locais[def.id].ordem).toBe('CALOR')
      expect(c.locais[def.id].houveAtaque).toBe(true)
    }
    expect(c.coordenado).toEqual({ n: 5, segundos: 0 })
    expect(c.ataquesRecentes).toHaveLength(5)
  })
  it('funciona com frio e não muta a cidade recebida', () => {
    const antes = criarCidade()
    const copia = structuredClone(antes)
    const c = ataqueEmMassa(antes, 'FRIO', 0)
    expect(antes).toEqual(copia)
    expect(Object.values(c.locais).every((l) => l.ordem === 'FRIO')).toBe(true)
  })
  it('recusa tipo desconhecido', () => {
    expect(() => ataqueEmMassa(criarCidade(), 'RAIO', 0)).toThrow()
  })
  it('só a UBS com C-Shield reage; as outras 4 ficam SOB_ATAQUE', () => {
    const c = avancar(ataqueEmMassa(criarCidade(), 'CALOR', 0), 2)
    expect(sit(c, 'ubs-vila-mariana')).toBe('ATAQUE_BLOQUEADO')
    for (const id of ['ubs-brasilandia', 'hemocentro-consolacao', 'farmacia-mooca', 'mercado-liberdade']) {
      expect(sit(c, id)).toBe('SOB_ATAQUE')
    }
  })
})

describe('recomecar (W18)', () => {
  it('volta exatamente ao estado inicial', () => {
    expect(recomecar()).toEqual(criarCidade())
  })
})

describe('placar (W19)', () => {
  it('antes de qualquer ataque mostra as duas UBS sem tempo de reação', () => {
    const p = placar(criarCidade())
    expect(p.map((l) => l.id)).toEqual(['ubs-vila-mariana', 'ubs-brasilandia'])
    expect(p.map((l) => l.protegido)).toEqual([true, false])
    expect(p.every((l) => l.reacaoSimMs === null)).toBe(true)
    expect(p.every((l) => l.situacao === 'NORMAL')).toBe(true)
  })
  it('depois do ataque: a UBS com C-Shield reage em segundos simulados e a outra leva 3h30', () => {
    const c = avancar(ataqueEmMassa(criarCidade(), 'CALOR', 0), 3)
    const [com, sem] = placar(c)
    expect(com.reacaoSimMs).toBeGreaterThan(0)
    expect(com.reacaoSimMs).toBeLessThanOrEqual(2000)
    expect(sem.reacaoSimMs).toBe(PERCEPCAO_SEM_CSHIELD_MIN * 60000)
    expect(PERCEPCAO_SEM_CSHIELD_MIN).toBe(210) // 3 h 30 min, do caso ICA
    expect(com.temperatura).toBeLessThanOrEqual(PERFIS_EMULADOR.VACINA.tMax)
    expect(sem.temperatura).toBeGreaterThan(PERFIS_EMULADOR.VACINA.tMax)
    expect(com.exposicao).toBe(0)
    expect(sem.exposicao).toBeGreaterThan(0)
    expect(com.situacao).toBe('ATAQUE_BLOQUEADO')
    expect(sem.situacao).toBe('SOB_ATAQUE')
  })
  it('traz nome e bairro para a tela', () => {
    const [com, sem] = placar(criarCidade())
    expect(com.nome).toBe('UBS Vila Mariana')
    expect(sem.nome).toBe('UBS Brasilândia')
  })
})

describe('formatarReacao', () => {
  it('sem ataque não mostra tempo', () => {
    expect(formatarReacao({ protegido: true, reacaoSimMs: null })).toBeNull()
    expect(formatarReacao({ protegido: false, reacaoSimMs: null })).toBeNull()
  })
  it('com C-Shield mostra segundos simulados', () => {
    expect(formatarReacao({ protegido: true, reacaoSimMs: 2000 })).toBe('2 s')
    expect(formatarReacao({ protegido: true, reacaoSimMs: 1400 })).toBe('1 s')
  })
  it('sem C-Shield mostra o tempo do caso: 3h30 até alguém perceber', () => {
    expect(formatarReacao({ protegido: false, reacaoSimMs: PERCEPCAO_SEM_CSHIELD_MIN * 60000 })).toBe(
      '3h30 até alguém perceber',
    )
  })
  it('funciona com o placar real', () => {
    const c = avancar(ataqueEmMassa(criarCidade(), 'CALOR', 0), 2)
    const [com, sem] = placar(c)
    expect(formatarReacao(com)).toBe('2 s')
    expect(formatarReacao(sem)).toBe('3h30 até alguém perceber')
  })
})

describe('removerCShield', () => {
  it('tira a proteção de um local instalado e volta a mostrar o ataque sem reação', () => {
    let c = instalarCShield(criarCidade(), 'ubs-brasilandia')
    c = avancar(c, 0.5)
    c = removerCShield(c, 'ubs-brasilandia')
    const l = c.locais['ubs-brasilandia']
    expect(l.protegido).toBe(false)
    expect(l.decisao).toBeNull()
    expect(sit(c, 'ubs-brasilandia')).toBe('NORMAL')
  })
  it('depois de remover, um ataque volta a esquentar a câmara', () => {
    let c = removerCShield(instalarCShield(criarCidade(), 'ubs-brasilandia'), 'ubs-brasilandia')
    c = avancar(atacar(c, 'ubs-brasilandia', 'CALOR', 0), 2)
    expect(sit(c, 'ubs-brasilandia')).toBe('SOB_ATAQUE')
    expect(c.locais['ubs-brasilandia'].temperatura).toBeGreaterThan(PERFIS_EMULADOR.VACINA.tMax)
  })
  it('não remove enquanto o local está bloqueado (só depois de liberar)', () => {
    let c = avancar(atacar(instalarCShield(criarCidade(), 'ubs-brasilandia'), 'ubs-brasilandia', 'CALOR', 0), 1)
    expect(sit(c, 'ubs-brasilandia')).toBe('ATAQUE_BLOQUEADO')
    expect(removerCShield(c, 'ubs-brasilandia')).toEqual(c)
    c = avancar(c, 10.5)
    c = avancar(liberar(c, 'ubs-brasilandia'), 0.2)
    expect(sit(c, 'ubs-brasilandia')).toBe('SEGURO')
    expect(removerCShield(c, 'ubs-brasilandia').locais['ubs-brasilandia'].protegido).toBe(false)
  })
  it('o piloto nunca sai e remover quem não está instalado não faz nada', () => {
    const c = criarCidade()
    expect(removerCShield(c, ID_PILOTO)).toEqual(c)
    expect(removerCShield(c, 'farmacia-mooca')).toEqual(c)
  })
  it('não muta a cidade recebida', () => {
    const c = instalarCShield(criarCidade(), 'ubs-brasilandia')
    const copia = structuredClone(c)
    removerCShield(c, 'ubs-brasilandia')
    expect(c).toEqual(copia)
  })
})

describe('pararAtaques', () => {
  it('desfaz a ordem do atacante em todos os locais e limpa o aviso de coordenado', () => {
    const c = pararAtaques(ataqueEmMassa(criarCidade(), 'CALOR', 0))
    for (const def of LOCAIS) expect(c.locais[def.id].ordem).toBe('NORMAL')
    expect(c.coordenado).toBeNull()
    expect(c.ataquesRecentes).toEqual([])
  })
  it('a câmara atacada volta para a faixa e o local vira seguro (lote em análise se houve exposição)', () => {
    let c = avancar(atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0), 3)
    expect(c.locais['ubs-brasilandia'].temperatura).toBeGreaterThan(PERFIS_EMULADOR.VACINA.tMax)
    c = avancar(pararAtaques(c), 10)
    expect(c.locais['ubs-brasilandia'].temperatura).toBeLessThanOrEqual(PERFIS_EMULADOR.VACINA.tMax)
    expect(sit(c, 'ubs-brasilandia')).toBe('SEGURO_LOTE_EM_ANALISE')
  })
  it('parar não solta o bloqueio: o C-Shield segue bloqueado até alguém liberar no local', () => {
    let c = avancar(atacar(criarCidade(), ID_PILOTO, 'CALOR', 0), 1)
    c = avancar(pararAtaques(c), 2)
    expect(sit(c, ID_PILOTO)).toBe('ATAQUE_BLOQUEADO')
    expect(c.locais[ID_PILOTO].contexto.bloqueado).toBe(true)
  })
  it('não muda os locais que não estavam sob ataque e não muta a cidade recebida', () => {
    const antes = atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0)
    const copia = structuredClone(antes)
    const depois = pararAtaques(antes)
    expect(antes).toEqual(copia)
    expect(depois.locais['farmacia-mooca']).toEqual(antes.locais['farmacia-mooca'])
    expect(sit(depois, 'farmacia-mooca')).toBe('NORMAL')
  })
  it('depois de parar dá para atacar de novo', () => {
    let c = pararAtaques(atacar(criarCidade(), 'ubs-brasilandia', 'CALOR', 0))
    c = avancar(atacar(c, 'ubs-brasilandia', 'CALOR', 1000), 2)
    expect(sit(c, 'ubs-brasilandia')).toBe('SOB_ATAQUE')
  })
})

describe('podeDesativar e motivoNaoDesativar', () => {
  it('pode desativar quando o local não está bloqueado', () => {
    const c = instalarCShield(criarCidade(), 'ubs-brasilandia')
    expect(podeDesativar(c.locais['ubs-brasilandia'])).toBe(true)
    expect(motivoNaoDesativar(c.locais['ubs-brasilandia'])).toBe('')
  })
  it('não pode durante o bloqueio e diz o que fazer', () => {
    const c = avancar(atacar(instalarCShield(criarCidade(), 'ubs-brasilandia'), 'ubs-brasilandia', 'CALOR', 0), 1)
    expect(podeDesativar(c.locais['ubs-brasilandia'])).toBe(false)
    expect(motivoNaoDesativar(c.locais['ubs-brasilandia'])).toBe('Libere o bloqueio no local primeiro.')
  })
})
