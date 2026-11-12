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
  1: 'text-4xl font-extrabold tracking-tight sm:text-6xl',
  2: 'text-3xl font-bold tracking-tight sm:text-4xl',
  3: 'text-xl font-bold',
}

export default function TituloLed({ nivel = 2, variante = 'repouso', className = '', children }) {
  const Tag = `h${nivel}`
  return <Tag className={`${TAMANHOS[nivel]} ${VARIANTES[variante]} ${className}`}>{children}</Tag>
}
