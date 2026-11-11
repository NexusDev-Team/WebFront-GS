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

// Ilustração própria da manchete: uma câmara fria com a porta entreaberta, faíscas saindo do
// painel de controle e um termômetro marcando 50 °C. Não usa imagem de nenhum jornal.
// As faíscas pulsam devagar e param com prefers-reduced-motion.
export default function IlustracaoGeladeira({ className = '' }) {
  return (
    <svg
      viewBox="0 0 320 340"
      role="img"
      aria-label="Ilustração: câmara fria com faíscas no painel de controle e um termômetro marcando 50 graus"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Corpo da câmara */}
      <rect x="40" y="30" width="150" height="270" rx="14" fill="var(--color-noite-900)" stroke="var(--color-gelo-300)" strokeWidth="3" />
      {/* Porta entreaberta */}
      <path d="M190 30 L246 52 V322 L190 300 Z" fill="var(--color-noite-950)" stroke="var(--color-gelo-300)" strokeWidth="3" />
      <path d="M232 150 V190" stroke="var(--color-gelo-50)" strokeWidth="5" />
      {/* Prateleiras e frascos */}
      <g stroke="var(--color-led-fraco)" strokeWidth="3">
        <path d="M56 120 H174 M56 190 H174 M56 260 H174" />
      </g>
      <g stroke="var(--color-led-forte)" strokeWidth="3">
        <rect x="68" y="92" width="14" height="28" rx="3" />
        <rect x="92" y="98" width="14" height="22" rx="3" />
        <rect x="116" y="92" width="14" height="28" rx="3" />
        <rect x="68" y="162" width="14" height="28" rx="3" />
        <rect x="100" y="168" width="14" height="22" rx="3" />
      </g>
      {/* Painel de controle e faíscas */}
      <rect x="62" y="48" width="56" height="26" rx="5" fill="var(--color-noite-950)" stroke="var(--color-ataque)" strokeWidth="3" />
      <g className="faisca-pulsa" stroke="var(--color-ataque)" strokeWidth="4">
        <path d="M126 50 L146 36 L138 54 L158 44" />
        <path d="M126 72 L148 80 L136 64 L156 70" />
        <path d="M54 44 L40 30 M58 40 L52 22" />
      </g>
      {/* Termômetro */}
      <rect x="262" y="40" width="22" height="200" rx="11" fill="var(--color-noite-900)" stroke="var(--color-gelo-300)" strokeWidth="3" />
      <circle cx="273" cy="262" r="24" fill="var(--color-noite-900)" stroke="var(--color-gelo-300)" strokeWidth="3" />
      <rect x="268" y="62" width="10" height="190" rx="5" fill="var(--color-ataque)" stroke="none" />
      <circle cx="273" cy="262" r="16" fill="var(--color-ataque)" stroke="none" />
      <g stroke="var(--color-gelo-300)" strokeWidth="2">
        <path d="M290 62 H302 M290 100 H298 M290 138 H302 M290 176 H298 M290 214 H302" />
      </g>
      <text x="40" y="326" fill="var(--color-gelo-50)" fontFamily="var(--font-mono)" fontSize="26" fontWeight="500">
        50 °C
      </text>
    </svg>
  )
}
