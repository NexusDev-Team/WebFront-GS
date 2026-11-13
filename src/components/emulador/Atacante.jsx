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

// O ícone do atacante: uma figura de capuz em vermelho. Fica no alto do card da simulação, com os
// botões de ataque logo abaixo; as linhas de ataque do mapa saem daqui. Decorativo (aria-hidden):
// o texto "Atacante" ao lado diz quem é.
export default function Atacante({ className = 'size-10' }) {
  return (
    <svg viewBox="-28 -28 56 56" aria-hidden="true" className={className}>
      <circle r={24} fill="var(--color-noite-900)" stroke="var(--color-ataque)" strokeWidth={3} />
      <g fill="none" stroke="var(--color-ataque)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M-12 12 Q-12 -14 0 -14 Q12 -14 12 12" />
        <path d="M-6 0 H6" />
      </g>
    </svg>
  )
}
