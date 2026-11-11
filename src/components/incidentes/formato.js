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

// Formatos de tela dos incidentes (só apresentação; as regras ficam em domain/incidentes.js).

// "11/11/26, 14:30"; se o texto não for uma data, mostra como veio.
export function formatarDataHora(texto) {
  const data = new Date(texto)
  if (Number.isNaN(data.getTime())) return String(texto ?? '')
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

// Número com vírgula e uma casa decimal, por exemplo "1,5".
export function formatarNumero(n) {
  return Number(n ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}
