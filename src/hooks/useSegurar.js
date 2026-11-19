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

/*
 * useSegurar(ms, aoCompletar) — o gesto de "segurar" do botão de liberação: só vale se
 * a pessoa segurar por `ms` (3 s no C-Shield). Funciona com mouse, toque e teclado (Espaço ou
 * Enter). Soltar antes cancela e zera. Completa uma única vez por pressão: para repetir, é
 * preciso soltar e segurar de novo.
 * Devolve { progresso (0 a 1), segurando, props }; `props` vai direto no botão.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

const PASSO_MS = 50
const TECLAS = [' ', 'Enter']

export function useSegurar(ms, aoCompletar) {
  const [progresso, setProgresso] = useState(0)
  const [segurando, setSegurando] = useState(false)
  const intervaloRef = useRef(null)
  const completouRef = useRef(false) // já completou nesta pressão
  const aoCompletarRef = useRef(aoCompletar) // sempre a versão mais nova, sem reiniciar o gesto

  useEffect(() => {
    aoCompletarRef.current = aoCompletar
  })

  const parar = useCallback(() => {
    clearInterval(intervaloRef.current)
    intervaloRef.current = null
    setSegurando(false)
    setProgresso(0)
  }, [])

  const comecar = useCallback(() => {
    if (intervaloRef.current !== null || completouRef.current) return
    const inicio = Date.now()
    setSegurando(true)
    intervaloRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - inicio) / ms)
      if (p >= 1) {
        completouRef.current = true
        parar()
        aoCompletarRef.current()
      } else {
        setProgresso(p)
      }
    }, PASSO_MS)
  }, [ms, parar])

  const soltar = useCallback(() => {
    completouRef.current = false
    parar()
  }, [parar])

  useEffect(() => () => clearInterval(intervaloRef.current), [])

  const props = {
    onPointerDown: (e) => {
      if (e.button === 0) comecar()
    },
    onPointerUp: soltar,
    onPointerLeave: soltar,
    onPointerCancel: soltar,
    onKeyDown: (e) => {
      if (!TECLAS.includes(e.key)) return
      e.preventDefault() // evita o clique padrão do botão
      if (!e.repeat) comecar()
    },
    onKeyUp: (e) => {
      if (TECLAS.includes(e.key)) soltar()
    },
    onBlur: soltar,
  }

  return { progresso, segurando, props }
}
