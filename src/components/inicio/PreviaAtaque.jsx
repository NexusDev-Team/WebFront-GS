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

// Prévia ilustrada do emulador: a ordem do atacante (linha vermelha tracejada, que corre até o
// alvo) bate no escudo do C-Shield e não passa; do outro lado, a câmara fria segue estável. É
// só uma figura (o jogo de verdade fica em /emulador). A linha para com prefers-reduced-motion
// (classe .linha-fluxo, em efeitos.css) e a figura inteira tem texto alternativo.
const ESCUDO = 'M24 3 L43 8.5 V29 L24 53 L5 29 V8.5 Z'

export default function PreviaAtaque({ className = '' }) {
  return (
    <svg
      viewBox="0 0 480 220"
      role="img"
      aria-label="Ilustração: a ordem do atacante bate no escudo do C-Shield e não passa; a câmara fria continua estável, a menos 19 graus."
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="previa-escudo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--color-gelo-azul)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ciano)' }} />
        </linearGradient>
      </defs>

      {/* Atacante */}
      <circle cx="62" cy="108" r="30" stroke="var(--color-critico)" strokeWidth="1.5" fill="var(--color-alerta-fundo)" />
      <text x="62" y="114" textAnchor="middle" className="fill-gelo-50 font-mono text-[18px]">
        {'>_'}
      </text>
      <text x="62" y="160" textAnchor="middle" className="fill-gelo-300 font-mono text-[11px]">
        ATACANTE
      </text>

      {/* A ordem corre até o escudo */}
      <path
        className="linha-fluxo"
        d="M96 108 H198"
        stroke="var(--color-critico)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g stroke="var(--color-critico)" strokeWidth="2" strokeLinecap="round">
        <path d="M204 94 L214 102" />
        <path d="M204 122 L214 114" />
        <path d="M200 108 H210" />
      </g>

      {/* Escudo do C-Shield */}
      <g transform="translate(214 78) scale(0.95)">
        <path d={ESCUDO} stroke="url(#previa-escudo)" strokeWidth="2.6" strokeLinejoin="round" fill="var(--color-noite-950)" />
        <path
          d="M24 15 V40 M13 21.5 L35 33.5 M35 21.5 L13 33.5"
          stroke="url(#previa-escudo)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <text x="240" y="160" textAnchor="middle" className="fill-gelo-300 font-mono text-[11px]">
        C-SHIELD
      </text>

      {/* Do outro lado, a ordem não chega: só o rastro apagado */}
      <path d="M280 108 H374" stroke="var(--color-gelo-300)" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />

      {/* Câmara fria */}
      <rect x="380" y="76" width="64" height="64" rx="14" stroke="var(--color-ok)" strokeWidth="1.5" fill="var(--color-superficie)" />
      <text x="412" y="114" textAnchor="middle" className="fill-gelo-50 font-mono text-[15px]">
        -19 °C
      </text>
      <text x="412" y="160" textAnchor="middle" className="fill-gelo-300 font-mono text-[11px]">
        CÂMARA FRIA
      </text>
    </svg>
  )
}
