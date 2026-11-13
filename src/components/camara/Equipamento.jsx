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

// Os equipamentos da câmara, desenhados de verdade (W26a): o aquecedor, a ventoinha de emergência
// e a refrigeração do controlador. No Wokwi eles são representados por LEDs, porque o simulador
// não tem esses equipamentos; aqui aparecem como são, cada um com o estado escrito ao lado.
//   aquecedor        estado: 'ligado' | 'cortado' | 'parado'
//   ventoinha        ligada: true | false   (a de emergência, do C-Shield)
//   refrigeracao     ligada: true | false   (a do controlador comercial)
const APAGADO = 'var(--color-gelo-300)'
const GLOW = (cor) => ({ filter: `drop-shadow(0 0 6px ${cor})` })

function Aquecedor({ estado }) {
  const quente = estado === 'ligado'
  const cor = quente ? 'var(--color-atencao)' : APAGADO
  return (
    <g fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 28 L14 28 L18 14 L26 42 L34 14 L42 42 L46 28 L50 28" stroke={cor} opacity={quente ? 1 : 0.55} style={quente ? GLOW(cor) : undefined} />
      {estado === 'cortado' ? <path d="M10 48 L46 8" stroke="var(--color-led-forte)" strokeWidth={4} /> : null}
    </g>
  )
}

function Ventoinha({ ligada }) {
  const cor = ligada ? 'var(--color-led-forte)' : APAGADO
  return (
    <g fill="none" stroke={cor} strokeWidth={3} strokeLinecap="round" opacity={ligada ? 1 : 0.55} style={ligada ? GLOW(cor) : undefined}>
      <circle cx={28} cy={28} r={22} />
      <g className={ligada ? 'gira' : undefined}>
        <path d="M28 28 C20 14 30 8 34 14 Z M28 28 C42 24 46 34 40 38 Z M28 28 C22 42 12 36 16 30 Z" fill={cor} fillOpacity={0.35} />
      </g>
      <circle cx={28} cy={28} r={3} fill={cor} />
    </g>
  )
}

function Refrigeracao({ ligada }) {
  const cor = ligada ? 'var(--color-led-forte)' : APAGADO
  return (
    <g fill="none" strokeWidth={3} strokeLinecap="round" opacity={ligada ? 1 : 0.55}>
      <g stroke={cor} style={ligada ? GLOW(cor) : undefined}>
        {[0, 60, 120].map((a) => (
          <g key={a} transform={`rotate(${a} 28 28)`}>
            <path d="M28 6 V50" />
            <path d="M22 12 L28 18 L34 12 M22 44 L28 38 L34 44" />
          </g>
        ))}
      </g>
      {ligada ? null : <path d="M10 48 L46 8" stroke="var(--color-ataque)" strokeWidth={4} />}
    </g>
  )
}

const ROTULOS = {
  aquecedor: {
    ligado: 'Aquecedor ligado',
    cortado: 'Aquecedor cortado pelo C-Shield',
    parado: 'Aquecedor desligado',
  },
  ventoinha: { true: 'Ventoinha de emergência ligada', false: 'Ventoinha de emergência desligada' },
  refrigeracao: { true: 'Refrigeração do controlador ligada', false: 'Refrigeração desligada pelo atacante' },
}

export default function Equipamento({ tipo, estado }) {
  const rotulo = ROTULOS[tipo][estado]
  return (
    <figure className="flex min-w-0 flex-col items-center gap-1 text-center">
      <svg viewBox="0 0 56 56" className="size-9" aria-hidden="true">
        {tipo === 'aquecedor' ? <Aquecedor estado={estado} /> : null}
        {tipo === 'ventoinha' ? <Ventoinha ligada={estado} /> : null}
        {tipo === 'refrigeracao' ? <Refrigeracao ligada={estado} /> : null}
      </svg>
      <figcaption className="text-xs leading-tight text-gelo-50">{rotulo}</figcaption>
    </figure>
  )
}
