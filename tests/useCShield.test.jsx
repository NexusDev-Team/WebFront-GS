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

// Hook da câmara por dentro: a vista do local com o relógio real de 1 s (alternância do LCD).
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { atacar, criarCidade, passo } from '../src/domain/cidade.js'
import { useCShield } from '../src/hooks/useCShield.js'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function bloqueada() {
  let c = atacar(criarCidade(), 'ubs-vila-mariana', 'CALOR', 0)
  for (let i = 0; i < 10; i++) c = passo(c, 100)
  return c
}

describe('useCShield', () => {
  it('devolve a vista da câmara do local escolhido', () => {
    const c = bloqueada()
    const { result } = renderHook(() => useCShield(c, 'ubs-vila-mariana'))
    expect(result.current.temCShield).toBe(true)
    expect(result.current.lcd[0]).toBe('Estado: Bloqueio')
    expect(result.current.corLed).toBe('azul')
    expect(result.current.equipamentos.aquecedor).toBe('cortado')
  })
  it('local sem C-Shield não tem LCD', () => {
    const { result } = renderHook(() => useCShield(criarCidade(), 'ubs-brasilandia'))
    expect(result.current.temCShield).toBe(false)
    expect(result.current.lcd).toBeNull()
  })
  it('a linha 2 do LCD alterna a cada 2 s reais', () => {
    const c = bloqueada()
    const { result } = renderHook(() => useCShield(c, 'ubs-vila-mariana'))
    const primeira = result.current.lcd[1]
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.lcd[1]).not.toBe(primeira)
  })
  it('um aviso passa à frente do estado e some quando o prazo acaba', () => {
    const c = bloqueada()
    const aviso = { tipo: 'LIBERADO', ateRealMs: Date.now() + 3000 }
    const { result } = renderHook(() => useCShield(c, 'ubs-vila-mariana', { aviso }))
    expect(result.current.lcd).toEqual(['Estado: Liberado', 'Controle normal'])
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.lcd[0]).toBe('Estado: Bloqueio')
  })
  it('o progresso de liberação mostra a barra no LCD', () => {
    const c = bloqueada()
    const { result } = renderHook(() => useCShield(c, 'ubs-vila-mariana', { progressoLiberacao: 0.25 }))
    expect(result.current.lcd).toEqual(['Liberando...', '█'.repeat(4)])
  })
  it('desmontar limpa o intervalo', () => {
    const { unmount } = renderHook(() => useCShield(criarCidade(), 'ubs-vila-mariana'))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
