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

import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Link de texto com seta que desliza no hover (padrão das seções do site). `to` é a rota interna.
// A seta só se move se a pessoa não pediu menos movimento.
export default function LinkSeta({ to, className = '', children }) {
  return (
    <Link
      to={to}
      className={`group inline-flex min-h-11 items-center gap-2 font-semibold text-ciano underline-offset-4 hover:underline ${className}`}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-300 ease-suave motion-safe:group-hover:translate-x-1"
      />
    </Link>
  )
}
