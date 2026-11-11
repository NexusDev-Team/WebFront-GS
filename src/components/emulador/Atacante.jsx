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

// O atacante, fora da cidade, no alto do mapa: uma figura de capuz em vermelho. As linhas de
// ataque saem daqui.
import { ATACANTE } from './geometria.js'

const HALO = { paintOrder: 'stroke', stroke: 'var(--color-noite-950)', strokeWidth: 6, strokeLinejoin: 'round' }

export default function Atacante() {
  return (
    <g transform={`translate(${ATACANTE.x} ${ATACANTE.y})`} role="img" aria-label="Atacante, fora da cidade">
      <circle r={24} fill="var(--color-noite-900)" stroke="var(--color-ataque)" strokeWidth={3} />
      <g fill="none" stroke="var(--color-ataque)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M-12 12 Q-12 -14 0 -14 Q12 -14 12 12" />
        <path d="M-6 0 H6" />
      </g>
      <text x={34} y={9} fontSize={26} fontWeight={600} fill="var(--color-gelo-50)" style={HALO}>
        Atacante
      </text>
    </g>
  )
}
