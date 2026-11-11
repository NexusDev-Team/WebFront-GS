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

// Regras das instalações do C-Shield (o CRUD do emulador): validação, payload e remoção.
import { describe, expect, it } from 'vitest'
import { atacar, criarCidade, passo } from '../src/domain/cidade.js'
import { instalarCShield } from '../src/domain/cidade-protecao.js'
import {
  idsInstalados,
  motivoNaoRemover,
  novaInstalacao,
  podeRemover,
  validarEdicaoInstalacao,
  validarInstalacao,
} from '../src/domain/instalacoes.js'

describe('validarInstalacao', () => {
  const ok = { localId: 'ubs-brasilandia', apelido: 'Sala 2', observacao: 'Geladeira nova' }

  it('formulário certo não tem erros, e apelido e observação são opcionais', () => {
    expect(validarInstalacao(ok, [])).toEqual({})
    expect(validarInstalacao({ localId: 'farmacia-mooca' }, [])).toEqual({})
    expect(validarInstalacao({ localId: 'farmacia-mooca', apelido: '', observacao: '' }, [])).toEqual({})
  })
  it('o local precisa existir', () => {
    expect(validarInstalacao({ ...ok, localId: '' }, []).localId).toBeTruthy()
    expect(validarInstalacao({ ...ok, localId: 'nao-existe' }, []).localId).toBeTruthy()
  })
  it('a unidade piloto já vem com o C-Shield', () => {
    expect(validarInstalacao({ ...ok, localId: 'ubs-vila-mariana' }, []).localId).toMatch(/piloto/)
  })
  it('não instala duas vezes no mesmo local', () => {
    expect(validarInstalacao(ok, ['ubs-brasilandia']).localId).toMatch(/já tem/)
  })
  it('apelido até 40 letras e observação até 200', () => {
    expect(validarInstalacao({ ...ok, apelido: 'a'.repeat(40) }, [])).toEqual({})
    expect(validarInstalacao({ ...ok, apelido: 'a'.repeat(41) }, []).apelido).toBeTruthy()
    expect(validarInstalacao({ ...ok, observacao: 'o'.repeat(200) }, [])).toEqual({})
    expect(validarInstalacao({ ...ok, observacao: 'o'.repeat(201) }, []).observacao).toBeTruthy()
  })
})

describe('validarEdicaoInstalacao', () => {
  it('só olha apelido e observação', () => {
    expect(validarEdicaoInstalacao({ apelido: 'Novo nome', observacao: '' })).toEqual({})
    expect(validarEdicaoInstalacao({ apelido: 'a'.repeat(41), observacao: '' }).apelido).toBeTruthy()
    expect(validarEdicaoInstalacao({ apelido: '', observacao: 'o'.repeat(201) }).observacao).toBeTruthy()
  })
})

describe('novaInstalacao', () => {
  it('monta o registro com textos aparados e a data da instalação', () => {
    expect(
      novaInstalacao({ localId: 'ubs-brasilandia', apelido: '  Sala 2 ', observacao: ' ok ' }, '2026-11-11T18:00:00.000Z'),
    ).toEqual({
      localId: 'ubs-brasilandia',
      apelido: 'Sala 2',
      observacao: 'ok',
      instaladoEm: '2026-11-11T18:00:00.000Z',
    })
  })
  it('campos ausentes viram texto vazio', () => {
    const r = novaInstalacao({ localId: 'farmacia-mooca' }, '2026-11-11T18:00:00.000Z')
    expect(r.apelido).toBe('')
    expect(r.observacao).toBe('')
  })
})

describe('idsInstalados', () => {
  it('lista os locais cadastrados, sem repetir e sem o piloto nem desconhecidos', () => {
    const lista = [
      { id: '1', localId: 'ubs-brasilandia' },
      { id: '2', localId: 'ubs-brasilandia' },
      { id: '3', localId: 'ubs-vila-mariana' },
      { id: '4', localId: 'nao-existe' },
      { id: '5', localId: 'farmacia-mooca' },
    ]
    expect(idsInstalados(lista)).toEqual(['ubs-brasilandia', 'farmacia-mooca'])
    expect(idsInstalados([])).toEqual([])
  })
})

describe('podeRemover e motivoNaoRemover', () => {
  it('pode remover quando o local não está bloqueado', () => {
    const c = instalarCShield(criarCidade(), 'ubs-brasilandia')
    expect(podeRemover(c.locais['ubs-brasilandia'])).toBe(true)
    expect(motivoNaoRemover(c.locais['ubs-brasilandia'])).toBe('')
  })
  it('não pode durante o bloqueio e diz o que fazer', () => {
    let c = atacar(instalarCShield(criarCidade(), 'ubs-brasilandia'), 'ubs-brasilandia', 'CALOR', 0)
    for (let i = 0; i < 10; i++) c = passo(c, 100)
    expect(podeRemover(c.locais['ubs-brasilandia'])).toBe(false)
    expect(motivoNaoRemover(c.locais['ubs-brasilandia'])).toBe('Libere o bloqueio no local primeiro.')
  })
})
