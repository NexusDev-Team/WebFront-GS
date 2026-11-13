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

import { Activity, BellRing, ScanSearch, ShieldAlert } from 'lucide-react'

// Ícone de cada passo de como o C-Shield protege (lucide). As chaves vêm de content/inicio.js:
// termometro = medir, escudo = decidir, rele = assumir o controle, sino = alertar.
const ICONES = {
  termometro: Activity,
  escudo: ScanSearch,
  rele: ShieldAlert,
  sino: BellRing,
}

export default function IconePasso({ nome, className = '' }) {
  const Icone = ICONES[nome] ?? Activity
  return <Icone aria-hidden="true" strokeWidth={1.75} className={className} />
}
