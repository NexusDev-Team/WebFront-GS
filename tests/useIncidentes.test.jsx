/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Vision. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 *
 * @vitest-environment jsdom
 */

// Hook do CRUD de incidentes com uma API falsa: carregar, filtrar, erro e as três escritas.
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useIncidentes } from '../src/hooks/useIncidentes.js'
import { ErroApi } from '../src/services/mockapi.js'

afterEach(cleanup)

const A = { id: '1', tipo: 'CALOR', status: 'ABERTO', localNome: 'A' }
const B = { id: '2', tipo: 'FRIO', status: 'EM_ANALISE', localNome: 'B' }

function apiFalsa(lista = [A, B]) {
  return {
    listar: vi.fn().mockResolvedValue(lista),
    criar: vi.fn(async (d) => ({ id: '9', ...d })),
    atualizar: vi.fn(async (id, d) => ({ id, ...lista.find((i) => i.id === id), ...d })),
    excluir: vi.fn(async (id) => ({ id })),
  }
}

describe('carregar', () => {
  it('lista ao montar, começando em carregando', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useIncidentes(api))
    expect(result.current.carregando).toBe(true)
    await waitFor(() => expect(result.current.carregando).toBe(false))
    expect(result.current.itens).toEqual([A, B])
    expect(result.current.erro).toBeNull()
    expect(api.listar).toHaveBeenCalledWith({ status: '', tipo: '' })
  })
  it('trocar o filtro lista de novo com o filtro novo', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useIncidentes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    act(() => result.current.setFiltros({ status: 'ABERTO', tipo: '' }))
    await waitFor(() => expect(api.listar).toHaveBeenLastCalledWith({ status: 'ABERTO', tipo: '' }))
    expect(result.current.filtros).toEqual({ status: 'ABERTO', tipo: '' })
  })
  it('descarta a resposta velha quando o filtro mudou no meio', async () => {
    let soltarPrimeira
    const api = apiFalsa()
    api.listar
      .mockImplementationOnce(() => new Promise((r) => (soltarPrimeira = r)))
      .mockResolvedValueOnce([B])
    const { result } = renderHook(() => useIncidentes(api))
    act(() => result.current.setFiltros({ status: '', tipo: 'FRIO' }))
    await waitFor(() => expect(result.current.itens).toEqual([B]))
    await act(async () => soltarPrimeira([A]))
    expect(result.current.itens).toEqual([B])
  })
})

describe('erro e recarregar', () => {
  it('guarda o erro e recarregar tenta de novo', async () => {
    const api = apiFalsa()
    api.listar.mockRejectedValueOnce(new ErroApi('Sem conexão com a API.'))
    const { result } = renderHook(() => useIncidentes(api))
    await waitFor(() => expect(result.current.erro?.message).toBe('Sem conexão com a API.'))
    expect(result.current.carregando).toBe(false)
    act(() => result.current.recarregar())
    await waitFor(() => expect(result.current.erro).toBeNull())
    await waitFor(() => expect(result.current.itens).toEqual([A, B]))
  })
})

describe('criar, atualizar e excluir', () => {
  it('criar põe o novo no topo e devolve o criado', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useIncidentes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    let criado
    await act(async () => {
      criado = await result.current.criar({ tipo: 'CALOR', status: 'ABERTO' })
    })
    expect(criado.id).toBe('9')
    expect(result.current.itens.map((i) => i.id)).toEqual(['9', '1', '2'])
  })
  it('criar não mostra na lista o que o filtro esconde', async () => {
    const api = apiFalsa([B])
    const { result } = renderHook(() => useIncidentes(api))
    act(() => result.current.setFiltros({ status: '', tipo: 'FRIO' }))
    await waitFor(() => expect(result.current.itens).toEqual([B]))
    await act(async () => {
      await result.current.criar({ tipo: 'CALOR', status: 'ABERTO' })
    })
    expect(result.current.itens).toEqual([B])
  })
  it('criar com erro repassa o erro e deixa a lista como está', async () => {
    const api = apiFalsa()
    api.criar.mockRejectedValueOnce(new ErroApi('A API respondeu com erro (500).', 500))
    const { result } = renderHook(() => useIncidentes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await expect(result.current.criar({})).rejects.toMatchObject({ status: 500 })
    })
    expect(result.current.itens).toEqual([A, B])
  })
  it('atualizar troca o item na lista', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useIncidentes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await result.current.atualizar('1', { status: 'EM_ANALISE', acaoTomada: 'Lote separado' })
    })
    expect(result.current.itens[0]).toMatchObject({ id: '1', status: 'EM_ANALISE', acaoTomada: 'Lote separado' })
  })
  it('atualizar tira da lista o item que deixou de casar com o filtro', async () => {
    const api = apiFalsa([A])
    const { result } = renderHook(() => useIncidentes(api))
    act(() => result.current.setFiltros({ status: 'ABERTO', tipo: '' }))
    await waitFor(() => expect(result.current.itens).toEqual([A]))
    await act(async () => {
      await result.current.atualizar('1', { status: 'RESOLVIDO' })
    })
    expect(result.current.itens).toEqual([])
  })
  it('excluir tira o item da lista', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useIncidentes(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await result.current.excluir('1')
    })
    expect(api.excluir).toHaveBeenCalledWith('1')
    expect(result.current.itens).toEqual([B])
  })
})
