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

// Floco de neve decorativo de 6 braços (a mesma geometria do escudo da logo). Só enfeite:
// fica escondido de leitor de tela, não anima e não recebe foco. A posição e a opacidade vêm
// do `className` de quem usa (por exemplo "absolute left-4 top-1/3 size-10 text-led-forte/30").
const ANGULOS = [0, 60, 120, 180, 240, 300]

export default function FlocoNeve({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      className={`pointer-events-none ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      {ANGULOS.map((angulo) => (
        <g key={angulo} transform={`rotate(${angulo} 24 24)`}>
          <path d="M24 24 V4" />
          <path d="M24 12 L19.5 7.5 M24 12 L28.5 7.5" />
          <path d="M24 18 L21 15 M24 18 L27 15" />
        </g>
      ))}
    </svg>
  )
}
