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

// Ícones dos quatro passos da solução, em SVG próprio (traço fino, como o escudo da logo).
const TRACOS = {
  termometro: <path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z" />,
  escudo: (
    <>
      <path d="M12 3 4 6v5.5c0 4.5 3.2 8 8 9.5 4.8-1.5 8-5 8-9.5V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  rele: (
    <>
      <circle cx="5" cy="14" r="2" />
      <circle cx="19" cy="14" r="2" />
      <path d="M7 14h4l4-6" />
      <path d="M3 20h18" />
    </>
  ),
  sino: (
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
}

export default function IconePasso({ nome, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {TRACOS[nome]}
    </svg>
  )
}
