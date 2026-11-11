/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Dev. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 *
 * @vitest-environment jsdom
 */

// Hook do CRUD de instalações com uma API falsa: carregar, erro e as três escritas.
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useInstalacoes } from '../src/hooks/useInstalacoes.js'
import { ErroApi } from '../src/services/mockapi.js'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const A = { id: '1', localId: 'ubs-brasilandia', apelido: 'Sala 1', observacao: '' }
const B = { id: '2', localId: 'farmacia-mooca', apelido: '', observacao: 'Nova' }

function apiFalsa(lista = [A, B]) {
  return {
    listar: vi.fn().mockResolvedValue(lista),
    criar: vi.fn(async (d) => ({ id: '9', ...d })),
    atualizar: vi.fn(async (id, d) => ({ ...lista.find((i) => i.id === id), id, ...d })),
    excluir: vi.fn(async (id) => ({ id })),
  }
}

describe('carregar', () => {
  it('lista ao montar, começando em carregando', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useInstalacoes(api))
    expect(result.current.carregando).toBe(true)
    await waitFor(() => expect(result.current.carregando).toBe(false))
    expect(result.current.itens).toEqual([A, B])
    expect(result.current.erro).toBeNull()
    expect(api.listar).toHaveBeenCalledTimes(1)
  })
  it('guarda o erro e recarregar tenta de novo', async () => {
    const api = apiFalsa()
    api.listar.mockRejectedValueOnce(new ErroApi('Sem conexão com a API.'))
    const { result } = renderHook(() => useInstalacoes(api))
    await waitFor(() => expect(result.current.erro?.message).toBe('Sem conexão com a API.'))
    expect(result.current.carregando).toBe(false)
    act(() => result.current.recarregar())
    await waitFor(() => expect(result.current.erro).toBeNull())
    await waitFor(() => expect(result.current.itens).toEqual([A, B]))
  })
})

describe('instalar', () => {
  it('manda o registro completo com a data de agora e põe no fim da lista', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-11T18:00:00.000Z'))
    const api = apiFalsa()
    const { result } = renderHook(() => useInstalacoes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    let criado
    await act(async () => {
      criado = await result.current.instalar({ localId: 'mercado-liberdade', apelido: ' Açougue ', observacao: '' })
    })
    expect(api.criar).toHaveBeenCalledWith({
      localId: 'mercado-liberdade',
      apelido: 'Açougue',
      observacao: '',
      instaladoEm: '2026-11-11T18:00:00.000Z',
    })
    expect(criado.id).toBe('9')
    expect(result.current.itens.map((i) => i.id)).toEqual(['1', '2', '9'])
  })
  it('com erro, repassa o erro e deixa a lista como está', async () => {
    const api = apiFalsa()
    api.criar.mockRejectedValueOnce(new ErroApi('A API respondeu com erro (500).', 500))
    const { result } = renderHook(() => useInstalacoes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await expect(result.current.instalar({ localId: 'mercado-liberdade' })).rejects.toMatchObject({ status: 500 })
    })
    expect(result.current.itens).toEqual([A, B])
  })
})

describe('editar e remover', () => {
  it('editar troca o item na lista', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useInstalacoes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await result.current.editar('1', { apelido: 'Sala 2', observacao: 'Trocou o filtro' })
    })
    expect(api.atualizar).toHaveBeenCalledWith('1', { apelido: 'Sala 2', observacao: 'Trocou o filtro' })
    expect(result.current.itens[0]).toMatchObject({ id: '1', apelido: 'Sala 2', observacao: 'Trocou o filtro' })
  })
  it('remover tira o item da lista', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useInstalacoes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await result.current.remover('1')
    })
    expect(api.excluir).toHaveBeenCalledWith('1')
    expect(result.current.itens).toEqual([B])
  })
  it('remover com erro mantém o item e repassa o erro', async () => {
    const api = apiFalsa()
    api.excluir.mockRejectedValueOnce(new ErroApi('A API respondeu com erro (500).', 500))
    const { result } = renderHook(() => useInstalacoes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await expect(result.current.remover('1')).rejects.toMatchObject({ status: 500 })
    })
    expect(result.current.itens).toEqual([A, B])
  })
})
