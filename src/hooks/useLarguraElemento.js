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
 * useLarguraElemento — mede a largura de um elemento e acompanha quando ela muda. O gráfico de
 * área usa isso para desenhar o SVG no tamanho real da tela (assim o texto dos eixos não encolhe
 * no celular). Devolve [ref, largura]; antes da primeira medida vale a largura inicial.
 */
import { useEffect, useRef, useState } from 'react'

const LARGURA_MINIMA = 200

export function useLarguraElemento(larguraInicial = 480) {
  const ref = useRef(null)
  const [largura, setLargura] = useState(larguraInicial)

  useEffect(() => {
    const no = ref.current
    if (!no || typeof ResizeObserver === 'undefined') return undefined
    const observador = new ResizeObserver(([entrada]) => {
      setLargura(Math.max(LARGURA_MINIMA, Math.round(entrada.contentRect.width)))
    })
    observador.observe(no)
    return () => observador.disconnect()
  }, [])

  return [ref, largura]
}
