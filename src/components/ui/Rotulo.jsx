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

// Rótulo curto acima do título da página: diz em que parte do site a pessoa está.
// Uso: no máximo um por página, só no topo.
export default function Rotulo({ className = '', children }) {
  return <p className={`text-sm font-medium text-led-forte ${className}`}>{children}</p>
}
