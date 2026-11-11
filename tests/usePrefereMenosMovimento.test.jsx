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

// Hook que lê prefers-reduced-motion, com um matchMedia falso que dispara o evento "change".
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePrefereMenosMovimento } from '../src/hooks/usePrefereMenosMovimento.js'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function falsoMatchMedia(inicial) {
  const ouvintes = new Set()
  const mq = {
    matches: inicial,
    addEventListener: vi.fn((_, f) => ouvintes.add(f)),
    removeEventListener: vi.fn((_, f) => ouvintes.delete(f)),
  }
  vi.stubGlobal('matchMedia', vi.fn(() => mq))
  return {
    mq,
    ouvintes,
    mudar(valor) {
      mq.matches = valor
      ouvintes.forEach((f) => f({ matches: valor }))
    },
  }
}

describe('usePrefereMenosMovimento', () => {
  it('lê a preferência atual', () => {
    falsoMatchMedia(true)
    expect(renderHook(() => usePrefereMenosMovimento()).result.current).toBe(true)
    cleanup()
    falsoMatchMedia(false)
    expect(renderHook(() => usePrefereMenosMovimento()).result.current).toBe(false)
  })
  it('consulta a media query certa', () => {
    falsoMatchMedia(false)
    renderHook(() => usePrefereMenosMovimento())
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })
  it('acompanha a mudança da preferência', () => {
    const f = falsoMatchMedia(false)
    const { result } = renderHook(() => usePrefereMenosMovimento())
    expect(result.current).toBe(false)
    act(() => f.mudar(true))
    expect(result.current).toBe(true)
  })
  it('remove o ouvinte ao desmontar', () => {
    const f = falsoMatchMedia(false)
    const { unmount } = renderHook(() => usePrefereMenosMovimento())
    expect(f.ouvintes.size).toBe(1)
    unmount()
    expect(f.ouvintes.size).toBe(0)
  })
  it('sem matchMedia no ambiente, assume movimento normal', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(renderHook(() => usePrefereMenosMovimento()).result.current).toBe(false)
  })
})
