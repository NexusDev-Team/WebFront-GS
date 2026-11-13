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

import { useId } from 'react'

// Diagrama "uma direção só" (arquitetura do C-Shield). No desktop é um SVG: a ordem do atacante
// (vermelho) chega ao controlador comercial e ao relé; o C-Shield mede com sensores próprios, veta
// pelo relé e só envia dados (setas azuis saindo); a linha tracejada vermelha termina num X antes
// do C-Shield: ele não escuta a rede. No celular o mesmo desenho vira duas colunas empilhadas.
// Tudo é decoração para quem vê: o texto alternativo e a lista de etapas vêm de content/comoFunciona.js.
const COR = {
  borda: 'var(--color-borda)',
  neutro: 'var(--color-gelo-300)',
  azul: 'var(--color-led-forte)',
  vermelho: 'var(--color-ataque)',
}

function No({ x, y, largura, altura, titulo, detalhe, destaque = false, perigo = false }) {
  const traco = destaque ? COR.azul : perigo ? 'rgba(255, 64, 88, 0.55)' : 'rgba(155, 175, 190, 0.35)'
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={largura}
        height={altura}
        rx="14"
        fill={destaque ? 'rgba(0, 207, 255, 0.12)' : perigo ? 'rgba(255, 64, 88, 0.07)' : 'var(--color-superficie)'}
        stroke={traco}
        strokeWidth={destaque ? 2 : 1.2}
      />
      <rect x={x + 14} y={y} width={largura - 28} height="2.5" rx="1.25" fill={traco} />
      <text x={x + largura / 2} y={y + altura / 2 - 3} textAnchor="middle" className="fill-gelo-50 text-[15px] font-semibold">
        {titulo}
      </text>
      <text x={x + largura / 2} y={y + altura / 2 + 17} textAnchor="middle" className="fill-gelo-300 text-[12px]">
        {detalhe}
      </text>
    </g>
  )
}

// `corre` anima o tracejado (classe .linha-fluxo): para com prefers-reduced-motion.
function Seta({ d, cor, marcador, tracejada = false, corre = false }) {
  return (
    <path
      d={d}
      className={corre ? 'linha-fluxo' : undefined}
      fill="none"
      stroke={cor}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={tracejada ? '7 6' : undefined}
      markerEnd={marcador ? `url(#${marcador})` : undefined}
    />
  )
}

function Ponta({ id, cor }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M1 1 L9 5 L1 9 Z" fill={cor} />
    </marker>
  )
}

function DiagramaLargo() {
  const base = useId().replace(/:/g, '')
  const azul = `${base}-azul`
  const vermelho = `${base}-vermelho`
  const neutro = `${base}-neutro`

  return (
    <svg viewBox="0 70 1000 400" className="hidden h-auto w-full md:block" aria-hidden="true" focusable="false">
      <defs>
        <Ponta id={azul} cor={COR.azul} />
        <Ponta id={vermelho} cor={COR.vermelho} />
        <Ponta id={neutro} cor={COR.neutro} />
        <radialGradient id={`${base}-halo`}>
          <stop offset="0" stopColor="#00cfff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#00cfff" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${base}-grade`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0 H0 V32" fill="none" stroke="#64cfff" strokeOpacity="0.06" />
        </pattern>
      </defs>

      <rect x="0" y="70" width="1000" height="400" fill={`url(#${base}-grade)`} />
      <ellipse cx="625" cy="345" rx="260" ry="120" fill={`url(#${base}-halo)`} />

      {/* o caminho da ordem do atacante até a câmara */}
      <No x={20} y={90} largura={190} altura={76} titulo="Internet" detalhe="atacante ou técnico" perigo />
      <No x={275} y={90} largura={190} altura={76} titulo="Controlador comercial" detalhe="vulnerável" perigo />
      <No x={530} y={90} largura={190} altura={76} titulo="Relé do C-Shield" detalhe="corta ou libera" />
      <No x={785} y={90} largura={190} altura={76} titulo="Câmara fria" detalhe="compressor e degelo" />
      <Seta d="M212 128 H271" cor={COR.vermelho} marcador={vermelho} corre />
      <text x={241} y={113} textAnchor="middle" className="fill-gelo-300 text-[12px]">ordem</text>
      <Seta d="M467 128 H526" cor={COR.neutro} marcador={neutro} />
      <Seta d="M722 128 H781" cor={COR.neutro} marcador={neutro} />

      {/* o C-Shield: mede, veta e só envia */}
      <No x={530} y={300} largura={190} altura={90} titulo="C-Shield (ESP32)" detalhe="sensores e regra próprios" destaque />
      <Seta d="M625 298 V170" cor={COR.azul} marcador={azul} />
      <text x={637} y={240} className="fill-led-forte text-[13px] font-semibold">veto</text>
      <Seta d="M880 168 V345 H724" cor={COR.azul} marcador={azul} />
      <text x={868} y={262} textAnchor="end" className="fill-gelo-300 text-[12px]">sensores próprios</text>

      {/* o envio de dados: só sai */}
      <No x={275} y={315} largura={190} altura={60} titulo="FIWARE" detalhe="estado e histórico" />
      <No x={20} y={315} largura={190} altura={60} titulo="Site" detalhe="só leitura" />
      <Seta d="M528 345 H469" cor={COR.azul} marcador={azul} />
      <text x={498} y={333} textAnchor="middle" className="fill-led-forte text-[12px] font-semibold">só envia</text>
      <Seta d="M273 345 H214" cor={COR.azul} marcador={azul} />
      <text x={243} y={333} textAnchor="middle" className="fill-gelo-300 text-[12px]">https</text>

      {/* o C-Shield não escuta a rede: a linha da internet termina num X */}
      <Seta d="M115 168 V252 H494" cor={COR.vermelho} tracejada corre />
      <path d="M496 244 L512 260 M512 244 L496 260" stroke={COR.vermelho} strokeWidth="3" strokeLinecap="round" />
      <text x={300} y={242} textAnchor="middle" className="fill-ataque text-[13px] font-semibold">não escuta a rede</text>

      {/* a liberação é presencial */}
      <No x={545} y={412} largura={160} altura={46} titulo="Botão no aparelho" detalhe="segurar 3 s libera" />
      <Seta d="M625 410 V394" cor={COR.neutro} marcador={neutro} />
    </svg>
  )
}

// Seta para baixo entre duas caixas do desenho de celular (traço fino, como os demais ícones).
function SetaBaixo({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" />
    </svg>
  )
}

// Uma coluna do desenho para o celular: caixas empilhadas e ligadas por setas para baixo.
function Cadeia({ titulo, nos }) {
  return (
    <div className="flex flex-col items-stretch gap-2">
      <p className="text-sm font-semibold text-gelo-300">{titulo}</p>
      {nos.map((no, indice) => (
        <div key={no.nome} className="flex flex-col items-center gap-2">
          {indice > 0 ? <SetaBaixo className={no.seta ?? 'text-gelo-300'} /> : null}
          <div
            className={`w-full rounded-xl border px-4 py-3 text-center ${
              no.destaque ? 'border-led-forte bg-led-forte/10' : 'border-borda bg-noite-900'
            }`}
          >
            <p className="font-semibold text-gelo-50">{no.nome}</p>
            <p className="text-sm text-gelo-300">{no.detalhe}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function DiagramaEmColunas() {
  return (
    <div className="flex flex-col gap-8 md:hidden" aria-hidden="true">
      <Cadeia
        titulo="O caminho da ordem do atacante"
        nos={[
          { nome: 'Internet', detalhe: 'atacante ou técnico' },
          { nome: 'Controlador comercial', detalhe: 'vulnerável', seta: 'text-ataque' },
          { nome: 'Relé do C-Shield', detalhe: 'corta ou libera' },
          { nome: 'Câmara fria', detalhe: 'compressor e degelo' },
        ]}
      />
      <Cadeia
        titulo="O caminho do C-Shield: só envia"
        nos={[
          { nome: 'Sensores próprios', detalhe: 'dentro da câmara' },
          { nome: 'C-Shield (ESP32)', detalhe: 'decide e veta pelo relé', destaque: true, seta: 'text-led-forte' },
          { nome: 'FIWARE', detalhe: 'estado e histórico', seta: 'text-led-forte' },
          { nome: 'Site', detalhe: 'só leitura', seta: 'text-led-forte' },
        ]}
      />
      <p className="rounded-xl border border-ataque/40 px-4 py-3 text-center text-gelo-50">
        <span className="inline-flex items-center gap-1.5 font-semibold text-ataque">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 3l10 10M13 3 3 13" />
          </svg>
          Não escuta a rede.
        </span> Só o botão do aparelho, segurado por
        3 segundos, libera o bloqueio.
      </p>
    </div>
  )
}

export default function DiagramaArquitetura({ descricao }) {
  return (
    <div role="img" aria-label={descricao} className="cartao p-4 sm:p-8">
      <DiagramaLargo />
      <DiagramaEmColunas />
    </div>
  )
}
