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

// Botão (ou link, com as=...) com alvo de toque de pelo menos 44 x 44 px (W48).
// `ariaLabel` serve aos textos em leet (4T4QU3 D3 C4L0R = "Ataque de calor").
const VARIANTES = {
  primario:
    'bg-led-forte text-noite-950 border-led-forte hover:bg-gelo-50 hover:border-gelo-50',
  ataque:
    'bg-noite-900 text-gelo-50 border-ataque hover:bg-ataque hover:text-noite-950',
  fantasma:
    'bg-transparent text-gelo-50 border-borda hover:border-led-forte hover:text-led-forte',
}

export default function BotaoLed({
  as: Tag = 'button',
  variante = 'primario',
  ariaLabel,
  type = 'button',
  className = '',
  children,
  ...resto
}) {
  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      aria-label={ariaLabel}
      className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 font-titulo text-base font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${className}`}
      {...resto}
    >
      {children}
    </Tag>
  )
}
