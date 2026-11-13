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

// Container padrão das páginas: largura máxima e respiro vertical. O <main> do App não limita a
// largura, para a página inicial poder usar faixas de ponta a ponta.
export default function Pagina({ as: Tag = 'div', className = '', children }) {
  return <Tag className={`conteudo py-16 ${className}`}>{children}</Tag>
}
