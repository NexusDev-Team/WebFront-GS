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

import { useId } from 'react'
import { NOME_PRODUTO } from '../../domain/produto.js'

// Logo do C-Shield em SVG próprio (Design System v1.0): escudo de borda dupla com degradê de gelo
// e um floco de neve de 6 braços com pontas em "V" (o gelo que protege). O wordmark sai de
// NOME_PRODUTO. Variantes: 'completa' (escudo + nome + slogan), 'compacta' (escudo + nome) e 'escudo'.
const ANGULOS = [0, 60, 120, 180, 240, 300]

function Escudo({ className = '' }) {
  // Cada instância precisa de um id próprio de degradê (a logo aparece várias vezes na página).
  const id = useId()
  const traco = `url(#${id})`
  return (
    <svg
      viewBox="0 0 48 56"
      className={className}
      fill="none"
      stroke={traco}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="8" y1="2" x2="40" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--color-gelo-azul)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ciano)' }} />
        </linearGradient>
      </defs>
      <path strokeWidth="2.6" d="M24 3 L43 8.5 V29 L24 53 L5 29 V8.5 Z" />
      <path strokeWidth="1.2" opacity="0.7" d="M24 9 L37.5 13 V28 L24 45.5 L10.5 28 V13 Z" />
      <g strokeWidth="2">
        {ANGULOS.map((angulo) => (
          <g key={angulo} transform={`rotate(${angulo} 24 27.5)`}>
            <path d="M24 27.5 V15.5" />
            <path d="M21.4 18.4 L24 15.5 L26.6 18.4" />
            <path d="M24 22.5 L21.8 20.3 M24 22.5 L26.2 20.3" />
          </g>
        ))}
      </g>
    </svg>
  )
}

export default function Logo({ variante = 'compacta', className = '' }) {
  if (variante === 'escudo') {
    return <Escudo className={`h-10 w-auto ${className}`} />
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Escudo className="h-10 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-titulo text-xl font-semibold tracking-[0.06em] text-gelo-50 sm:text-2xl">
          {NOME_PRODUTO.toUpperCase()}
        </span>
        {variante === 'completa' && (
          <span className="mt-1.5 max-w-52 text-sm leading-snug text-gelo-300">
            Segurança inteligente para câmaras frias.
          </span>
        )}
      </span>
    </span>
  )
}
