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

// Cartão padrão do site (classe .cartao): degradê sutil, borda fina e sombra funda, como no mockup.
// O nome ficou PainelVidro por compatibilidade; o texto é sempre opaco.
export default function PainelVidro({
  as: Tag = 'div',
  className = '',
  children,
  ...resto
}) {
  const classes = ['cartao', className].filter(Boolean).join(' ')
  return (
    <Tag className={classes} {...resto}>
      {children}
    </Tag>
  )
}
