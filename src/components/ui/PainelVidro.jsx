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

// Painel translúcido com geada nos cantos. Só o fundo é translúcido: o texto é opaco (W45).
export default function PainelVidro({
  as: Tag = 'div',
  scanlines = false,
  className = '',
  children,
  ...resto
}) {
  const classes = ['painel-vidro', scanlines ? 'scanlines' : '', className].filter(Boolean).join(' ')
  return (
    <Tag className={classes} {...resto}>
      {children}
    </Tag>
  )
}
