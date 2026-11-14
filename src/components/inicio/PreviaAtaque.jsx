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

import imagemLogo from '../../assets/logo-c-shield.png'

// Prévia ilustrada do emulador (referência: a arte aprovada do card, com a logo oficial como escudo): a ordem do atacante (linha
// vermelha tracejada, que corre até o alvo) bate no escudo de gelo do C-Shield e não passa; do
// outro lado, a câmara fria segue estável. É só uma figura (o jogo de verdade fica em /emulador).
// A linha, a geada e o halo animam devagar e param com prefers-reduced-motion (classes em
// efeitos.css); a figura inteira tem texto alternativo. O estado (bloqueado, estável) também está
// escrito, nunca só na cor.
// Um braço do floco de neve (do centro para cima, com duas ramificações); o resto é rotação.
const BRACO = 'M0 0 V-13 M0 -8 L-4 -12 M0 -8 L4 -12'
const ROTACOES = [0, 60, 120, 180, 240, 300]

function Floco({ x, y, escala, stroke, largura }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${escala})`}
      stroke={stroke}
      strokeWidth={largura}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ROTACOES.map((r) => (
        <path key={r} d={BRACO} transform={`rotate(${r})`} />
      ))}
    </g>
  )
}

// Fragmentos de geada ao redor do escudo: [x, y, raio, atraso (s)].
const GEADA = [
  [236, 120, 1.8, 0],
  [250, 214, 1.4, 1.2],
  [226, 170, 1.2, 2.4],
  [404, 126, 1.8, 0.6],
  [414, 196, 1.5, 1.8],
  [392, 232, 1.2, 3],
  [300, 96, 1.2, 2],
  [346, 100, 1.5, 0.8],
]

export default function PreviaAtaque({ className = '' }) {
  return (
    <svg
      viewBox="0 0 640 340"
      role="img"
      aria-label="Ilustração: a ordem do atacante bate no escudo do C-Shield e não passa; a câmara fria continua estável, a menos 19 graus."
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="previa-ataque" gradientUnits="userSpaceOnUse" x1="184" y1="0" x2="262" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--color-ataque)', stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ataque)' }} />
        </linearGradient>
        <radialGradient id="previa-halo-escudo">
          <stop offset="0.55" style={{ stopColor: 'var(--color-ciano)', stopOpacity: 0.1 }} />
          <stop offset="0.9" style={{ stopColor: 'var(--color-ciano)', stopOpacity: 0.3 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ciano)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="previa-halo-ataque">
          <stop offset="0" style={{ stopColor: 'var(--color-ataque)', stopOpacity: 0.28 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ataque)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="previa-halo-ok">
          <stop offset="0" style={{ stopColor: 'var(--color-ok)', stopOpacity: 0.22 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ok)', stopOpacity: 0 }} />
        </radialGradient>
        <filter id="previa-brilho" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="desfoque" />
          <feMerge>
            <feMergeNode in="desfoque" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="previa-grade" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0 H0 V30" stroke="var(--color-gelo-azul)" strokeOpacity="0.1" strokeWidth="1" />
        </pattern>
        <linearGradient id="previa-mascara" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.2" stopColor="#fff" />
          <stop offset="0.8" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.2" />
        </linearGradient>
        <mask id="previa-mascara-grade">
          <rect width="640" height="340" fill="url(#previa-mascara)" />
        </mask>
      </defs>

      {/* Moldura interna arredondada e grade técnica */}
      <rect x="8" y="8" width="624" height="324" rx="24" fill="var(--color-noite-950)" fillOpacity="0.55" stroke="var(--color-gelo-azul)" strokeOpacity="0.3" />
      <rect x="8" y="8" width="624" height="324" rx="24" fill="url(#previa-grade)" mask="url(#previa-mascara-grade)" />

      {/* Halos de cada lado */}
      <circle cx="105" cy="178" r="90" fill="url(#previa-halo-ataque)" />
      <circle cx="540" cy="178" r="90" fill="url(#previa-halo-ok)" />

      {/* Atacante: janela de terminal com brilho vermelho */}
      <g filter="url(#previa-brilho)">
        <rect x="40" y="130" width="130" height="96" rx="14" fill="var(--color-ataque)" fillOpacity="0.14" stroke="var(--color-ataque)" strokeWidth="2" />
      </g>
      <rect x="40" y="130" width="130" height="96" rx="14" fill="var(--color-noite-950)" fillOpacity="0.6" />
      <path d="M40 160 H170" stroke="var(--color-ataque)" strokeOpacity="0.7" />
      <circle cx="56" cy="145" r="4" fill="var(--color-ataque)" />
      <circle cx="70" cy="145" r="4" fill="var(--color-ataque)" fillOpacity="0.75" />
      <circle cx="84" cy="145" r="4" fill="var(--color-ataque)" fillOpacity="0.5" />
      <text x="54" y="190" className="fill-gelo-50 font-mono text-[16px]">
        {'$ set_temp'}
      </text>
      <text x="54" y="212" className="fill-ataque font-mono text-[16px]">
        {'> +40 °C'}
      </text>
      <text x="105" y="252" textAnchor="middle" className="fill-gelo-300 font-mono text-[14px] tracking-widest">
        ATACANTE
      </text>

      {/* A ordem corre até o escudo (tracejada, grossa) e termina em chevron */}
      <path className="linha-fluxo" d="M184 178 H252" stroke="url(#previa-ataque)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M254 166 L268 178 L254 190" stroke="var(--color-ataque)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Colchetes de impacto */}
      <g stroke="var(--color-ataque)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M262 128 V152 L276 166" />
        <path d="M262 228 V204 L276 190" />
      </g>

      {/* Escudo de gelo: halo, geada, escudo, floco de neve e pingentes */}
      <g className="halo-respira">
        <circle cx="330" cy="178" r="96" fill="url(#previa-halo-escudo)" />
        <circle cx="330" cy="178" r="92" stroke="var(--color-ciano)" strokeOpacity="0.35" strokeWidth="1.5" />
      </g>
      {GEADA.map(([x, y, r, atraso]) => (
        <circle
          key={`${x}-${y}`}
          className="geada-flutua"
          cx={x}
          cy={y}
          r={r}
          fill="var(--color-gelo-100)"
          fillOpacity="0.7"
          style={{ animationDelay: `${atraso}s` }}
        />
      ))}
      <image href={imagemLogo} x="258" y="108" width="144" height="128" preserveAspectRatio="xMidYMid meet" />
      <text x="330" y="276" textAnchor="middle" className="fill-gelo-100 font-mono text-[15px] tracking-widest">
        C-SHIELD
      </text>
      <g filter="url(#previa-brilho)">
        <rect x="278" y="40" width="104" height="32" rx="16" fill="var(--color-noite-950)" stroke="var(--color-led-forte)" strokeWidth="1.5" />
      </g>
      <rect x="278" y="40" width="104" height="32" rx="16" fill="var(--color-noite-950)" stroke="var(--color-led-forte)" strokeWidth="1.5" />
      <text x="330" y="61" textAnchor="middle" className="fill-led-forte font-mono text-[14px] font-bold tracking-widest">
        BLOQUEADO
      </text>
      <path d="M330 72 V84" stroke="var(--color-led-forte)" strokeOpacity="0.6" strokeDasharray="2 4" />

      {/* Do outro lado, a ordem não chega: só o rastro apagado */}
      <path d="M420 178 H474" stroke="var(--color-gelo-300)" strokeOpacity="0.45" strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round" />

      {/* Câmara fria: borda verde com brilho */}
      <g filter="url(#previa-brilho)">
        <rect x="480" y="130" width="120" height="96" rx="18" fill="var(--color-ok)" fillOpacity="0.12" stroke="var(--color-ok)" strokeWidth="2" />
      </g>
      <rect x="480" y="130" width="120" height="96" rx="18" fill="var(--color-noite-950)" fillOpacity="0.55" />
      <Floco x={540} y={162} escala={1.15} stroke="var(--color-gelo-azul)" largura={1.8} />
      <text x="540" y="208" textAnchor="middle" className="fill-gelo-50 font-mono text-[28px] font-bold">
        -19 °C
      </text>
      <text x="540" y="252" textAnchor="middle" className="fill-gelo-300 font-mono text-[14px] tracking-widest">
        CÂMARA FRIA
      </text>
      <rect x="500" y="40" width="80" height="32" rx="16" fill="var(--color-noite-950)" stroke="var(--color-ok)" strokeWidth="1.5" />
      <text x="540" y="61" textAnchor="middle" className="fill-ok font-mono text-[14px] font-bold tracking-widest">
        ESTÁVEL
      </text>
      <path d="M540 72 V128" stroke="var(--color-ok)" strokeOpacity="0.6" strokeDasharray="2 4" />

      {/* Rodapé: a ordem vem de fora, a decisão fica dentro */}
      <path d="M40 290 H600" stroke="var(--color-gelo-azul)" strokeOpacity="0.35" />
      <text x="40" y="314" className="fill-gelo-300 font-mono text-[13px]">
        ordem de fora: não passa
      </text>
      <text x="600" y="314" textAnchor="end" className="fill-gelo-300 font-mono text-[13px]">
        decisão no aparelho
      </text>
    </svg>
  )
}
