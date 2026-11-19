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

// Um local no mapa: o círculo com o ícone do que ele guarda, o escudo azul se tiver C-Shield, a
// temperatura e a situação em texto. É um botão de verdade (role="button", Tab, Enter e Espaço)
// e a cor sempre vem acompanhada de texto.
import { RAIO_ESCUDO, RAIO_LOCAL } from './geometria.js'
import { COR_SITUACAO, ROTULO_SITUACAO } from './rotulos.js'
import { formatarGraus as graus } from '../ui/formato.js'

// Ícone de cada tipo de local, desenhado em torno de (0, 0), com cerca de 30 de largura.
const ICONES = {
  VACINA: <path d="M-5 -14 H5 M-3 -14 V-8 M3 -14 V-8 M-8 -8 H8 V12 Q8 16 4 16 H-4 Q-8 16 -8 12 Z M-8 0 H8" />,
  INSULINA: <path d="M-5 -14 H5 V-5 H14 V5 H5 V14 H-5 V5 H-14 V-5 H-5 Z" />,
  PLASMA: <path d="M0 -16 C10 -3 12 3 12 7 A12 12 0 0 1 -12 7 C-12 3 -10 -3 0 -16 Z" />,
  CONGELADO: (
    <path d="M-15 -12 H-9 L-5 8 H11 L14 -6 H-7 M-3 14 A3 3 0 1 0 -3 14.01 M9 14 A3 3 0 1 0 9 14.01" />
  ),
}

const HALO = { paintOrder: 'stroke', stroke: 'var(--color-noite-950)', strokeWidth: 6, strokeLinejoin: 'round' }

export default function LocalNoMapa({ def, local, situacaoLocal, selecionado, aoSelecionar }) {
  const cor = COR_SITUACAO[situacaoLocal]
  const rotulo = ROTULO_SITUACAO[situacaoLocal]
  const sobAtaque = situacaoLocal === 'SOB_ATAQUE'
  const preenchimento = sobAtaque
    ? 'color-mix(in srgb, var(--color-ataque) 25%, var(--color-noite-900))'
    : 'var(--color-noite-900)'
  const temperatura = graus(local.temperatura)

  function aoTeclar(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      aoSelecionar(def.id)
    }
  }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={selecionado}
      aria-label={`${def.nome}, ${rotulo.toLowerCase()}, ${temperatura} graus, ${local.protegido ? 'com' : 'sem'} C-Shield`}
      transform={`translate(${def.x} ${def.y})`}
      onClick={() => aoSelecionar(def.id)}
      onKeyDown={aoTeclar}
      className="group cursor-pointer outline-none"
    >
      {/* Área de toque grande e invisível */}
      <circle r={RAIO_ESCUDO + 12} fill="transparent" />
      {selecionado ? (
        <circle r={RAIO_ESCUDO + 10} fill="none" stroke="var(--color-gelo-50)" strokeWidth={2} strokeDasharray="6 6" />
      ) : null}
      {/* Anel redondo só para quem navega pelo teclado (no lugar do quadrado de foco do navegador) */}
      <circle
        r={RAIO_ESCUDO + 10}
        fill="none"
        stroke="var(--color-gelo-50)"
        strokeWidth={3}
        className="opacity-0 group-focus-visible:opacity-100"
      />
      {local.protegido ? (
        <circle
          r={RAIO_ESCUDO}
          fill="none"
          stroke="var(--color-led-forte)"
          strokeWidth={4}
          style={{ filter: 'drop-shadow(0 0 8px var(--color-led-forte))' }}
        />
      ) : null}
      <g className={sobAtaque ? 'led-falha' : undefined}>
        <circle r={RAIO_LOCAL} fill={preenchimento} stroke={cor} strokeWidth={4} />
        <g fill="none" stroke="var(--color-gelo-50)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          {ICONES[def.perfil]}
        </g>
      </g>
      {/* No celular os rótulos ficariam pequenos demais: quem mostra o texto é a ListaLocais */}
      <g textAnchor="middle" style={{ pointerEvents: 'none' }} className="max-sm:hidden">
        <text
          y={RAIO_ESCUDO + 30}
          fontSize={28}
          fontWeight={600}
          fill="var(--color-gelo-50)"
          textDecoration={selecionado ? 'underline' : undefined}
          style={HALO}
        >
          {def.bairro}
        </text>
        <text y={RAIO_ESCUDO + 60} fontSize={28} fill="var(--color-gelo-50)" fontFamily="var(--font-mono)" style={HALO}>
          {temperatura} °C
        </text>
        <text y={RAIO_ESCUDO + 88} fontSize={24} fill="var(--color-gelo-50)" style={HALO}>
          <tspan fill={cor}>● </tspan>
          {rotulo}
        </text>
      </g>
    </g>
  )
}
