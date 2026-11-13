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
// (classe .linha-fluxo, em efeitos.css) e a figura inteira tem texto alternativo. O estado
// (bloqueado, estável) também está escrito, nunca só na cor.
const ESCUDO = 'M24 3 L43 8.5 V29 L24 53 L5 29 V8.5 Z'

export default function PreviaAtaque({ className = '' }) {
  return (
    <svg
      viewBox="0 0 560 260"
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
        <linearGradient id="previa-ataque" gradientUnits="userSpaceOnUse" x1="124" y1="0" x2="240" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--color-ataque)', stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ataque)' }} />
        </linearGradient>
        <radialGradient id="previa-halo-escudo">
          <stop offset="0" style={{ stopColor: 'var(--color-ciano)', stopOpacity: 0.32 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ciano)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="previa-halo-ataque">
          <stop offset="0" style={{ stopColor: 'var(--color-ataque)', stopOpacity: 0.22 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ataque)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="previa-halo-ok">
          <stop offset="0" style={{ stopColor: 'var(--color-ok)', stopOpacity: 0.18 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ok)', stopOpacity: 0 }} />
        </radialGradient>
        <pattern id="previa-grade" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0 H0 V28" stroke="var(--color-gelo-azul)" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
        <linearGradient id="previa-mascara" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.15" stopColor="#fff" />
          <stop offset="0.85" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="previa-mascara-grade">
          <rect width="560" height="260" fill="url(#previa-mascara)" />
        </mask>
      </defs>

      {/* Grade técnica de fundo, esmaecida nas pontas */}
      <rect width="560" height="260" fill="url(#previa-grade)" mask="url(#previa-mascara-grade)" />

      {/* Halos de cada lado */}
      <circle cx="70" cy="125" r="70" fill="url(#previa-halo-ataque)" />
      <circle cx="280" cy="125" r="80" fill="url(#previa-halo-escudo)" />
      <circle cx="490" cy="125" r="70" fill="url(#previa-halo-ok)" />

      {/* Atacante: janela de terminal */}
      <rect x="22" y="92" width="96" height="66" rx="10" fill="var(--color-noite-950)" stroke="var(--color-ataque)" strokeWidth="1.5" />
      <path d="M22 108 H118" stroke="var(--color-ataque)" strokeOpacity="0.4" />
      <circle cx="34" cy="100" r="2.5" fill="var(--color-ataque)" />
      <circle cx="44" cy="100" r="2.5" fill="var(--color-ataque)" fillOpacity="0.5" />
      <circle cx="54" cy="100" r="2.5" fill="var(--color-ataque)" fillOpacity="0.25" />
      <text x="32" y="130" className="fill-gelo-50 font-mono text-[13px]">
        {'$ set_temp'}
      </text>
      <text x="32" y="147" className="fill-ataque font-mono text-[13px]">
        {'> +40 °C'}
      </text>
      <text x="70" y="182" textAnchor="middle" className="fill-gelo-300 font-mono text-[11px] tracking-widest">
        ATACANTE
      </text>

      {/* A ordem corre até o escudo e se desfaz no impacto */}
      <path className="linha-fluxo" d="M124 125 H236" stroke="url(#previa-ataque)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M242 125 L232 118 M242 125 L232 132" stroke="var(--color-ataque)" strokeWidth="2.5" strokeLinecap="round" />
      <g stroke="var(--color-ataque)" strokeLinecap="round" strokeWidth="1.8" strokeOpacity="0.8">
        <path d="M244 100 L252 108" />
        <path d="M244 150 L252 142" />
        <path d="M240 90 V98" />
        <path d="M240 160 V152" />
      </g>

      {/* Escudo do C-Shield */}
      <g transform="translate(254 94) scale(1.25)">
        <path d={ESCUDO} stroke="url(#previa-escudo)" strokeWidth="2.4" strokeLinejoin="round" fill="var(--color-noite-950)" />
        <path
          d="M24 15 V40 M13 21.5 L35 33.5 M35 21.5 L13 33.5"
          stroke="url(#previa-escudo)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <text x="284" y="182" textAnchor="middle" className="fill-gelo-300 font-mono text-[11px] tracking-widest">
        C-SHIELD
      </text>
      <g>
        <rect x="240" y="40" width="88" height="26" rx="13" fill="var(--color-noite-950)" stroke="var(--color-led-forte)" strokeOpacity="0.7" />
        <text x="284" y="57" textAnchor="middle" className="fill-led-forte font-mono text-[11px] font-semibold tracking-widest">
          BLOQUEADO
        </text>
      </g>
      <path d="M284 66 V90" stroke="var(--color-led-forte)" strokeOpacity="0.5" strokeDasharray="2 4" />

      {/* Do outro lado, a ordem não chega: só o rastro apagado */}
      <path d="M330 125 H418" stroke="var(--color-gelo-300)" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />

      {/* Câmara fria */}
      <rect x="426" y="88" width="88" height="74" rx="14" fill="var(--color-superficie)" stroke="var(--color-ok)" strokeWidth="1.5" />
      <path
        d="M470 98 V114 M463 102 L477 110 M477 102 L463 110"
        stroke="var(--color-gelo-azul)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <text x="470" y="144" textAnchor="middle" className="fill-gelo-50 font-mono text-[18px] font-semibold">
        -19 °C
      </text>
      <text x="470" y="182" textAnchor="middle" className="fill-gelo-300 font-mono text-[11px] tracking-widest">
        CÂMARA FRIA
      </text>
      <g>
        <rect x="438" y="40" width="64" height="26" rx="13" fill="var(--color-noite-950)" stroke="var(--color-ok)" strokeOpacity="0.7" />
        <text x="470" y="57" textAnchor="middle" className="fill-ok font-mono text-[11px] font-semibold tracking-widest">
          ESTÁVEL
        </text>
      </g>
      <path d="M470 66 V86" stroke="var(--color-ok)" strokeOpacity="0.5" strokeDasharray="2 4" />

      {/* Rodapé: a ordem vem de fora, a decisão fica dentro */}
      <path d="M22 220 H538" stroke="var(--color-borda)" />
      <text x="22" y="244" className="fill-gelo-300 font-mono text-[11px]">
        ordem de fora: não passa
      </text>
      <text x="538" y="244" textAnchor="end" className="fill-gelo-300 font-mono text-[11px]">
        decisão no aparelho
      </text>
    </svg>
  )
}
