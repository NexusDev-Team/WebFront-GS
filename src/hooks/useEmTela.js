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

import { useEffect, useRef, useState } from 'react'

// Diz se o elemento está visível na janela (IntersectionObserver). Serve para pausar animações
// ambientais fora da tela e poupar CPU/GPU (skill optimize-web-animations). Sem suporte ao
// observer, considera sempre visível. Devolve [ref, visivel].
export function useEmTela() {
  const ref = useRef(null)
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento || typeof IntersectionObserver === 'undefined') return undefined
    const observador = new IntersectionObserver(([entrada]) => setVisivel(entrada.isIntersecting))
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  return [ref, visivel]
}
