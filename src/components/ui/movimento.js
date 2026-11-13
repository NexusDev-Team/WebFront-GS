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

// Variantes da entrada escalonada (hero e cabeçalhos de página): cada bloco sobe 24 px e aparece,
// com 120 ms de diferença entre eles. O MotionConfig do App desliga o deslocamento para quem pede
// menos movimento.
export const ENTRADA_CONTAINER = { hidden: {}, visivel: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }

export const ENTRADA_ITEM = {
  hidden: { opacity: 0, y: 24 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}
