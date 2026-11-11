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

// Hook do jogo: o laço de tempo, as ações e os eventos, com timers falsos (Date.now também).
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { situacao } from '../src/domain/cidade-placar.js'
import { useCidadeSimulada } from '../src/hooks/useCidadeSimulada.js'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  cleanup()
  Object.defineProperty(document, 'hidden', { value: false, configurable: true })
  vi.useRealTimers()
})

const avancar = (ms) => act(() => vi.advanceTimersByTime(ms))
const sit = (r, id) => situacao(r.current.cidade.locais[id])

describe('laço de tempo', () => {
  it('começa na cidade inicial, com o placar das duas UBS', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    expect(result.current.cidade.relogioSimMs).toBe(0)
    expect(result.current.placar).toHaveLength(2)
    expect(result.current.eventos.novosBloqueios).toEqual([])
  })
  it('1 s real vale 1 min simulado', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    avancar(1000)
    expect(result.current.cidade.relogioSimMs).toBe(60000)
  })
  it('uma aba que dormiu não dá salto: o passo é limitado a 250 ms reais', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    avancar(100)
    act(() => {
      vi.setSystemTime(Date.now() + 60000)
      vi.advanceTimersByTime(100)
    })
    expect(result.current.cidade.relogioSimMs).toBeLessThanOrEqual(6000 + 250 * 60)
  })
  it('para quando a aba está oculta e volta a andar quando reaparece', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    avancar(500)
    const antes = result.current.cidade.relogioSimMs
    Object.defineProperty(document, 'hidden', { value: true, configurable: true })
    avancar(2000)
    expect(result.current.cidade.relogioSimMs).toBe(antes)
    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
    avancar(500)
    expect(result.current.cidade.relogioSimMs).toBeGreaterThan(antes)
  })
  it('desmontar limpa o intervalo', () => {
    const { unmount } = renderHook(() => useCidadeSimulada())
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('ações', () => {
  it('atacar um local desprotegido o deixa SOB_ATAQUE', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    act(() => result.current.atacar('ubs-brasilandia', 'CALOR'))
    avancar(1500)
    expect(sit(result, 'ubs-brasilandia')).toBe('SOB_ATAQUE')
    expect(result.current.cidade.locais['ubs-brasilandia'].temperatura).toBeGreaterThan(8)
  })
  it('atacar o local protegido gera ATAQUE_BLOQUEADO e um evento só', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    act(() => result.current.atacar('ubs-vila-mariana', 'CALOR'))
    avancar(300)
    expect(sit(result, 'ubs-vila-mariana')).toBe('ATAQUE_BLOQUEADO')
    expect(result.current.eventos.novosBloqueios).toEqual(['ubs-vila-mariana'])
    const id = result.current.eventos.id
    avancar(3000)
    expect(result.current.eventos.id).toBe(id)
  })
  it('ataque em massa marca o coordenado com 5 locais', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    act(() => result.current.ataqueEmMassa('CALOR'))
    expect(result.current.cidade.coordenado).toEqual({ n: 5, segundos: 0 })
  })
  it('três ataques individuais em menos de 20 s reais marcam o coordenado no terceiro clique', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    act(() => result.current.atacar('ubs-brasilandia', 'CALOR'))
    avancar(3000)
    act(() => result.current.atacar('farmacia-mooca', 'CALOR'))
    avancar(3000)
    expect(result.current.cidade.coordenado).toBeNull()
    act(() => result.current.atacar('mercado-liberdade', 'FRIO'))
    expect(result.current.cidade.coordenado).toMatchObject({ n: 3 })
  })
  it('ativar o C-Shield bloqueia o local atacado, e recomeçar volta ao início', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    act(() => result.current.atacar('ubs-brasilandia', 'CALOR'))
    avancar(1500)
    act(() => result.current.ativarCShield())
    avancar(300)
    expect(sit(result, 'ubs-brasilandia')).toBe('ATAQUE_BLOQUEADO')
    act(() => result.current.recomecar())
    expect(result.current.cidade.relogioSimMs).toBe(0)
    expect(sit(result, 'ubs-brasilandia')).toBe('NORMAL')
  })
  it('liberar devolve SEM_BLOQUEIO, RECUSADA e ACEITA conforme o caso', () => {
    const { result } = renderHook(() => useCidadeSimulada())
    let r
    act(() => {
      r = result.current.liberar('ubs-vila-mariana')
    })
    expect(r).toBe('SEM_BLOQUEIO')
    act(() => result.current.atacar('ubs-vila-mariana', 'CALOR'))
    avancar(3000)
    act(() => {
      r = result.current.liberar('ubs-vila-mariana')
    })
    expect(r).toBe('RECUSADA')
    avancar(8000)
    act(() => {
      r = result.current.liberar('ubs-vila-mariana')
    })
    expect(r).toBe('ACEITA')
    avancar(300)
    expect(result.current.eventos.liberados).toEqual(['ubs-vila-mariana'])
    expect(sit(result, 'ubs-vila-mariana')).toBe('SEGURO')
  })
})
