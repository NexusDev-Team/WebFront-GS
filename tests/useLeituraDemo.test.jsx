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

// Hook da leitura simulada: a série do sensor avança uma leitura a cada 2 s (a demonstração da
// página inicial) e fica parada quando a pessoa pede menos movimento.
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLeituraDemo } from '../src/hooks/useLeituraDemo.js'

const CONFIG = { base: -19.2, amplitude: 1.2, semente: 7, n: 24 }

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useLeituraDemo', () => {
  it('começa com n leituras dentro da faixa dos congelados', () => {
    const { result } = renderHook(() => useLeituraDemo(CONFIG))
    expect(result.current).toHaveLength(24)
    for (const { temperatura } of result.current) expect(temperatura).toBeLessThanOrEqual(-18)
  })
  it('a cada 2 s entra uma leitura nova e a mais antiga sai (sempre n pontos)', () => {
    const { result } = renderHook(() => useLeituraDemo(CONFIG))
    const antes = result.current
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current).toHaveLength(24)
    expect(result.current[0].indice).toBe(antes[0].indice + 1)
    expect(result.current[23].indice).toBe(antes[23].indice + 1)
  })
  it('antes de 2 s a série ainda é a mesma', () => {
    const { result } = renderHook(() => useLeituraDemo(CONFIG))
    const antes = result.current
    act(() => vi.advanceTimersByTime(1900))
    expect(result.current).toBe(antes)
  })
  it('com movimento reduzido a série não avança', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
    const { result } = renderHook(() => useLeituraDemo(CONFIG))
    const antes = result.current
    act(() => vi.advanceTimersByTime(10000))
    expect(result.current).toEqual(antes)
  })
  it('ao desmontar, o intervalo é limpo', () => {
    const { unmount } = renderHook(() => useLeituraDemo(CONFIG))
    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
