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

// Hook do CRUD das câmaras do bairro com uma API falsa: carregar, filtrar, erro e as três escritas.
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCamaras } from '../src/hooks/useCamaras.js'
import { ErroApi } from '../src/services/mockapi.js'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const A = { id: '1', nome: 'UBS Sul', bairro: 'Santo Amaro', tipo: 'VACINA', observacao: '' }
const B = { id: '2', nome: 'Açougue Central', bairro: 'Mooca', tipo: 'CONGELADO', observacao: 'Freezer' }

function apiFalsa(lista = [A, B]) {
  return {
    listar: vi.fn().mockResolvedValue(lista),
    criar: vi.fn(async (d) => ({ id: '9', ...d })),
    atualizar: vi.fn(async (id, d) => ({ ...lista.find((i) => i.id === id), id, ...d })),
    excluir: vi.fn(async (id) => ({ id })),
  }
}

describe('carregar e filtrar', () => {
  it('lista ao montar, começando em carregando, sem filtro', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useCamaras(api))
    expect(result.current.carregando).toBe(true)
    await waitFor(() => expect(result.current.carregando).toBe(false))
    expect(result.current.itens).toEqual([A, B])
    expect(api.listar).toHaveBeenCalledWith({ tipo: '' })
  })
  it('trocar o filtro de tipo lista de novo com o tipo', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useCamaras(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    act(() => result.current.setFiltroTipo('VACINA'))
    await waitFor(() => expect(api.listar).toHaveBeenLastCalledWith({ tipo: 'VACINA' }))
    expect(result.current.filtroTipo).toBe('VACINA')
  })
  it('descarta a resposta velha quando o filtro mudou no meio', async () => {
    let soltarPrimeira
    const api = apiFalsa()
    api.listar.mockImplementationOnce(() => new Promise((r) => (soltarPrimeira = r))).mockResolvedValueOnce([B])
    const { result } = renderHook(() => useCamaras(api))
    act(() => result.current.setFiltroTipo('CONGELADO'))
    await waitFor(() => expect(result.current.itens).toEqual([B]))
    await act(async () => soltarPrimeira([A]))
    expect(result.current.itens).toEqual([B])
  })
  it('guarda o erro e recarregar tenta de novo', async () => {
    const api = apiFalsa()
    api.listar.mockRejectedValueOnce(new ErroApi('Sem conexão com a API.'))
    const { result } = renderHook(() => useCamaras(api))
    await waitFor(() => expect(result.current.erro?.message).toBe('Sem conexão com a API.'))
    expect(result.current.carregando).toBe(false)
    act(() => result.current.recarregar())
    await waitFor(() => expect(result.current.erro).toBeNull())
    await waitFor(() => expect(result.current.itens).toEqual([A, B]))
  })
})

describe('cadastrar, editar e excluir', () => {
  it('cadastrar manda o registro com a data de agora e põe no topo da lista', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-12T10:00:00.000Z'))
    const api = apiFalsa()
    const { result } = renderHook(() => useCamaras(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    let criado
    await act(async () => {
      criado = await result.current.cadastrar({ nome: ' Hemocentro Norte ', bairro: 'Santana', tipo: 'PLASMA', observacao: '' })
    })
    expect(api.criar).toHaveBeenCalledWith({
      nome: 'Hemocentro Norte',
      bairro: 'Santana',
      tipo: 'PLASMA',
      observacao: '',
      cadastradoEm: '2026-11-12T10:00:00.000Z',
    })
    expect(criado.id).toBe('9')
    expect(result.current.itens.map((i) => i.id)).toEqual(['9', '1', '2'])
  })
  it('cadastrar não mostra na lista o que o filtro esconde', async () => {
    const api = apiFalsa([B])
    const { result } = renderHook(() => useCamaras(api))
    act(() => result.current.setFiltroTipo('CONGELADO'))
    await waitFor(() => expect(result.current.itens).toEqual([B]))
    await act(async () => {
      await result.current.cadastrar({ nome: 'Outro', bairro: 'Sé', tipo: 'VACINA' })
    })
    expect(result.current.itens).toEqual([B])
  })
  it('cadastrar com erro repassa o erro e deixa a lista como está', async () => {
    const api = apiFalsa()
    api.criar.mockRejectedValueOnce(new ErroApi('A API respondeu com erro (500).', 500))
    const { result } = renderHook(() => useCamaras(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await expect(result.current.cadastrar({ nome: 'Ab', bairro: 'Cd', tipo: 'VACINA' })).rejects.toMatchObject({ status: 500 })
    })
    expect(result.current.itens).toEqual([A, B])
  })
  it('editar manda só os campos do formulário e troca o item na lista', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useCamaras(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await result.current.editar('1', { nome: ' UBS Sul 2 ', bairro: 'Santo Amaro', tipo: 'VACINA', observacao: 'Trocou o filtro' })
    })
    expect(api.atualizar).toHaveBeenCalledWith('1', {
      nome: 'UBS Sul 2',
      bairro: 'Santo Amaro',
      tipo: 'VACINA',
      observacao: 'Trocou o filtro',
    })
    expect(result.current.itens[0]).toMatchObject({ id: '1', nome: 'UBS Sul 2', observacao: 'Trocou o filtro' })
  })
  it('editar o tipo tira da lista o item que deixou de casar com o filtro', async () => {
    const api = apiFalsa([A])
    const { result } = renderHook(() => useCamaras(api))
    act(() => result.current.setFiltroTipo('VACINA'))
    await waitFor(() => expect(result.current.itens).toEqual([A]))
    await act(async () => {
      await result.current.editar('1', { nome: 'UBS Sul', bairro: 'Santo Amaro', tipo: 'PLASMA', observacao: '' })
    })
    expect(result.current.itens).toEqual([])
  })
  it('excluir tira o item da lista; com erro, mantém e repassa o erro', async () => {
    const api = apiFalsa()
    const { result } = renderHook(() => useCamaras(api))
    await waitFor(() => expect(result.current.carregando).toBe(false))
    await act(async () => {
      await result.current.excluir('1')
    })
    expect(api.excluir).toHaveBeenCalledWith('1')
    expect(result.current.itens).toEqual([B])
    api.excluir.mockRejectedValueOnce(new ErroApi('A API respondeu com erro (500).', 500))
    await act(async () => {
      await expect(result.current.excluir('2')).rejects.toMatchObject({ status: 500 })
    })
    expect(result.current.itens).toEqual([B])
  })
})
