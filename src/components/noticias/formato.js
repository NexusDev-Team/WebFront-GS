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

// Formato de tela das datas das notícias (só apresentação).

// "2026-11-02" → "2 de novembro de 2026". Usa o meio-dia para o fuso não mudar o dia.
export function formatarDataLonga(dataIso) {
  const data = new Date(`${dataIso}T12:00:00`)
  if (Number.isNaN(data.getTime())) return dataIso
  return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}
