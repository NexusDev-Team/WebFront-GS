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
import { LOCAIS, atacar, criarCidade } from '../src/domain/cidade.js'
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
