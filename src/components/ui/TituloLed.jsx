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

// Título da página ou da seção. A variante conta o estado:
//   repouso = texto neutro · ataque = vermelho com falha de energia (só no emulador, durante
//   um ataque) · assumiu = azul-glacial com glow (o C-Shield está no controle).
const VARIANTES = {
  repouso: 'text-gelo-50',
  ataque: 'led-falha text-critico',
  assumiu: 'led-forte',
}

const TAMANHOS = {
  1: 'text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.08] font-bold tracking-tight',
  2: 'text-[clamp(1.875rem,3.5vw,3rem)] leading-[1.1] font-semibold tracking-tight',
  3: 'text-2xl font-semibold',
}

export default function TituloLed({ nivel = 2, variante = 'repouso', className = '', children }) {
  const Tag = `h${nivel}`
  return <Tag className={`${TAMANHOS[nivel]} ${VARIANTES[variante]} ${className}`}>{children}</Tag>
}
