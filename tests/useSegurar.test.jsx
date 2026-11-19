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

// Hook do botão de segurar: mouse/toque, teclado, cancelamento e conclusão única.
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSegurar } from '../src/hooks/useSegurar.js'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const avancar = (ms) => act(() => vi.advanceTimersByTime(ms))
const evento = (extra = {}) => ({ button: 0, repeat: false, key: ' ', preventDefault: vi.fn(), ...extra })

function montar(ms = 3000) {
  const aoCompletar = vi.fn()
  const r = renderHook(() => useSegurar(ms, aoCompletar))
  return { ...r, aoCompletar }
}

describe('mouse e toque', () => {
  it('o progresso cresce enquanto segura', () => {
    const { result } = montar()
    expect(result.current.progresso).toBe(0)
    expect(result.current.segurando).toBe(false)
    act(() => result.current.props.onPointerDown(evento()))
    avancar(1500)
    expect(result.current.segurando).toBe(true)
    expect(result.current.progresso).toBeGreaterThan(0.45)
    expect(result.current.progresso).toBeLessThan(0.55)
  })
  it('completa ao chegar em 3 s, uma vez só, e zera', () => {
    const { result, aoCompletar } = montar()
    act(() => result.current.props.onPointerDown(evento()))
    avancar(3100)
    expect(aoCompletar).toHaveBeenCalledTimes(1)
    expect(result.current.progresso).toBe(0)
    expect(result.current.segurando).toBe(false)
    avancar(5000) // continua segurando: não repete
    expect(aoCompletar).toHaveBeenCalledTimes(1)
  })
  it('depois de soltar dá para segurar de novo', () => {
    const { result, aoCompletar } = montar()
    act(() => result.current.props.onPointerDown(evento()))
    avancar(3100)
    act(() => result.current.props.onPointerUp(evento()))
    act(() => result.current.props.onPointerDown(evento()))
    avancar(3100)
    expect(aoCompletar).toHaveBeenCalledTimes(2)
  })
  it('soltar antes de 3 s cancela e zera o progresso', () => {
    const { result, aoCompletar } = montar()
    act(() => result.current.props.onPointerDown(evento()))
    avancar(2000)
    act(() => result.current.props.onPointerUp(evento()))
    expect(result.current.progresso).toBe(0)
    expect(result.current.segurando).toBe(false)
    avancar(5000)
    expect(aoCompletar).not.toHaveBeenCalled()
  })
  it('sair do botão ou cancelar o toque também cancela', () => {
    const { result, aoCompletar } = montar()
    act(() => result.current.props.onPointerDown(evento()))
    avancar(1000)
    act(() => result.current.props.onPointerLeave(evento()))
    expect(result.current.segurando).toBe(false)
    act(() => result.current.props.onPointerDown(evento()))
    avancar(1000)
    act(() => result.current.props.onPointerCancel(evento()))
    expect(result.current.segurando).toBe(false)
    avancar(5000)
    expect(aoCompletar).not.toHaveBeenCalled()
  })
  it('só o botão principal do mouse segura', () => {
    const { result, aoCompletar } = montar()
    act(() => result.current.props.onPointerDown(evento({ button: 2 })))
    avancar(4000)
    expect(aoCompletar).not.toHaveBeenCalled()
  })
})

describe('teclado', () => {
  it('Espaço e Enter seguram e completam', () => {
    for (const tecla of [' ', 'Enter']) {
      const { result, aoCompletar, unmount } = montar()
      act(() => result.current.props.onKeyDown(evento({ key: tecla })))
      avancar(3100)
      expect(aoCompletar).toHaveBeenCalledTimes(1)
      unmount()
    }
  })
  it('a repetição automática da tecla não reinicia a contagem', () => {
    const { result, aoCompletar } = montar()
    act(() => result.current.props.onKeyDown(evento()))
    avancar(2000)
    act(() => result.current.props.onKeyDown(evento({ repeat: true })))
    avancar(1100)
    expect(aoCompletar).toHaveBeenCalledTimes(1)
  })
  it('soltar a tecla cancela; outras teclas são ignoradas', () => {
    const { result, aoCompletar } = montar()
    act(() => result.current.props.onKeyDown(evento({ key: 'a' })))
    expect(result.current.segurando).toBe(false)
    act(() => result.current.props.onKeyDown(evento()))
    avancar(1000)
    act(() => result.current.props.onKeyUp(evento()))
    expect(result.current.segurando).toBe(false)
    avancar(5000)
    expect(aoCompletar).not.toHaveBeenCalled()
  })
  it('impede o clique padrão do Espaço e do Enter', () => {
    const { result } = montar()
    const e = evento()
    act(() => result.current.props.onKeyDown(e))
    expect(e.preventDefault).toHaveBeenCalled()
  })
})

describe('limpeza', () => {
  it('desmontar no meio da contagem limpa o intervalo e não completa', () => {
    const { result, unmount, aoCompletar } = montar()
    act(() => result.current.props.onPointerDown(evento()))
    avancar(1000)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
    vi.advanceTimersByTime(5000)
    expect(aoCompletar).not.toHaveBeenCalled()
  })
  it('usa sempre a versão mais nova de aoCompletar', () => {
    const a = vi.fn()
    const b = vi.fn()
    const { result, rerender } = renderHook(({ f }) => useSegurar(3000, f), { initialProps: { f: a } })
    act(() => result.current.props.onPointerDown(evento()))
    avancar(1000)
    rerender({ f: b })
    avancar(2100)
    expect(a).not.toHaveBeenCalled()
    expect(b).toHaveBeenCalledTimes(1)
  })
})
