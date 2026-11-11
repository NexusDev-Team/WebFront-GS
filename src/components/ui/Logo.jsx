/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Vision. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */

import { NOME_PRODUTO } from '../../domain/produto.js'

// Logo do C-Shield em SVG próprio: escudo com floco de neve de 6 braços (o gelo que protege).
// Variantes: 'completa' (escudo + nome + slogan), 'compacta' (escudo + nome) e 'escudo'.
const ANGULOS = [0, 60, 120, 180, 240, 300]

function Escudo({ className = '' }) {
  return (
    <svg
      viewBox="0 0 48 56"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path strokeWidth="3" d="M24 4 L42 10.5 V27 C42 39 34 47.5 24 51.5 C14 47.5 6 39 6 27 V10.5 Z" />
      <g strokeWidth="2.2">
        {ANGULOS.map((angulo) => (
          <g key={angulo} transform={`rotate(${angulo} 24 28)`}>
            <path d="M24 28 V16" />
            <path d="M24 21.5 L20.8 18.3 M24 21.5 L27.2 18.3" />
          </g>
        ))}
      </g>
    </svg>
  )
}

export default function Logo({ variante = 'compacta', className = '' }) {
  if (variante === 'escudo') {
    return <Escudo className={`h-10 w-auto text-led-forte ${className}`} />
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Escudo className="h-10 w-auto shrink-0 text-led-forte" />
      <span className="flex flex-col leading-none">
        <span className="font-titulo text-2xl font-bold tracking-wide text-gelo-50">
          {NOME_PRODUTO.toUpperCase()}
        </span>
        {variante === 'completa' && (
          <span className="mt-1 max-w-52 text-sm leading-snug text-gelo-300">
            Segurança inteligente para câmaras frias.
          </span>
        )}
      </span>
    </span>
  )
}
