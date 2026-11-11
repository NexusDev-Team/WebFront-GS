/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Vision. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */

// Domínio da cidade do emulador: 5 locais, ataques, proteção e o fluxo completo do jogo.
import { describe, expect, it } from 'vitest'
import { LOCAIS, atacar, criarCidade, passo } from '../src/domain/cidade.js'
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
    expect(Object.keys(h[0]).sort()).toEqual(['temperatura', 'tSimMin'])
    expect(h[h.length - 1].tSimMin).toBeGreaterThan(h[0].tSimMin)
  })
})
