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

// Título com efeito de LED. A variante conta o estado da história:
//   repouso = azul suave e estável · ataque = falha + glitch · assumiu = azul forte firme.
const VARIANTES = {
  repouso: 'led-brilho text-gelo-50',
  ataque: 'led-falha glitch-ataque text-gelo-50',
  assumiu: 'led-forte',
}

const TAMANHOS = {
  1: 'text-4xl sm:text-5xl font-bold',
  2: 'text-2xl sm:text-3xl font-bold',
  3: 'text-xl font-semibold',
}

export default function TituloLed({ nivel = 2, variante = 'repouso', className = '', children }) {
  const Tag = `h${nivel}`
  return <Tag className={`${TAMANHOS[nivel]} ${VARIANTES[variante]} ${className}`}>{children}</Tag>
}
