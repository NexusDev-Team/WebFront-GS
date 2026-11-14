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

// Diagrama "uma direção só" (arquitetura do C-Shield), no estilo da arte aprovada: moldura
// arredondada com grade e caixas com brilho por cor (vermelho = perigo, verde = relé, ciano =
// C-Shield). No desktop é um SVG: a ordem do atacante
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

// Cada tipo de caixa tem borda e brilho próprios (como na arte aprovada): perigo (vermelho),
// seguro (verde, o relé), destaque (ciano, o C-Shield) e neutro (azul acinzentado, sem brilho forte).
const ESTILO_NO = {
  perigo: { traco: 'rgba(255, 64, 88, 0.9)', fundo: 'rgba(255, 64, 88, 0.1)', brilho: 'brilho-vermelho', largura: 2 },
  seguro: { traco: 'rgba(0, 229, 155, 0.9)', fundo: 'rgba(0, 229, 155, 0.08)', brilho: 'brilho-verde', largura: 2 },
  destaque: { traco: 'rgba(120, 225, 255, 0.95)', fundo: 'rgba(0, 207, 255, 0.12)', brilho: 'brilho-ciano', largura: 2.5 },
  neutro: { traco: 'rgba(120, 160, 200, 0.45)', fundo: 'rgba(14, 32, 50, 0.7)', brilho: null, largura: 1.5 },
}

function No({ base, x, y, largura, altura, titulo, detalhe, tipo = 'neutro' }) {
  const estilo = ESTILO_NO[tipo]
  const retangulo = (props) => (
    <rect x={x} y={y} width={largura} height={altura} rx="18" {...props} />
  )
  return (
    <g>
      {estilo.brilho
        ? <g filter={`url(#${base}-${estilo.brilho})`}>{retangulo({ fill: estilo.fundo, stroke: estilo.traco, strokeWidth: estilo.largura })}</g>
        : null}
      {retangulo({ fill: 'var(--color-superficie)', fillOpacity: 0.85 })}
      {retangulo({ fill: estilo.fundo, stroke: estilo.traco, strokeWidth: estilo.largura })}
      <text x={x + largura / 2} y={y + altura / 2 - 2} textAnchor="middle" className="fill-gelo-50 text-[17px] font-bold">
        {titulo}
      </text>
      <text x={x + largura / 2} y={y + altura / 2 + 19} textAnchor="middle" className="fill-gelo-300 text-[13px]">
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
          <path d="M32 0 H0 V32" fill="none" stroke="#64cfff" strokeOpacity="0.09" />
        </pattern>
        {[['vermelho', '#ff4058'], ['verde', '#00e59b'], ['ciano', '#00cfff']].map(([nome, cor]) => (
          <filter key={nome} id={`${base}-brilho-${nome}`} x="-30%" y="-40%" width="160%" height="180%">
            <feGaussianBlur stdDeviation="7" result="desfoque" />
            <feFlood floodColor={cor} floodOpacity="0.55" />
            <feComposite in2="desfoque" operator="in" result="cor" />
            <feMerge>
              <feMergeNode in="cor" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {/* moldura interna arredondada e grade técnica */}
      <rect x="0" y="72" width="1000" height="396" rx="28" fill="rgba(2, 9, 18, 0.45)" stroke="#64cfff" strokeOpacity="0.28" />
      <rect x="0" y="72" width="1000" height="396" rx="28" fill={`url(#${base}-grade)`} />
      <ellipse cx="625" cy="345" rx="260" ry="120" fill={`url(#${base}-halo)`} />

      {/* o caminho da ordem do atacante até a câmara */}
      <No base={base} x={15} y={90} largura={200} altura={76} titulo="Internet" detalhe="atacante ou técnico" tipo="perigo" />
      <No base={base} x={270} y={90} largura={200} altura={76} titulo="Controlador comercial" detalhe="vulnerável" tipo="perigo" />
      <No base={base} x={525} y={90} largura={200} altura={76} titulo="Relé do C-Shield" detalhe="corta ou libera" tipo="seguro" />
      <No base={base} x={780} y={90} largura={200} altura={76} titulo="Câmara fria" detalhe="compressor e degelo" />
      <Seta d="M219 128 H266" cor={COR.vermelho} marcador={vermelho} corre />
      <text x={242} y={110} textAnchor="middle" className="fill-gelo-300 text-[13px]">ordem</text>
      <Seta d="M474 128 H521" cor={COR.neutro} marcador={neutro} />
      <Seta d="M729 128 H776" cor={COR.neutro} marcador={neutro} />

      {/* o C-Shield: mede, veta e só envia */}
      <No base={base} x={525} y={300} largura={200} altura={90} titulo="C-Shield (ESP32)" detalhe="sensores e regra próprios" tipo="destaque" />
      <Seta d="M625 298 V170" cor={COR.azul} marcador={azul} />
      <text x={637} y={240} className="fill-led-forte text-[13px] font-semibold">veto</text>
      <Seta d="M880 168 V345 H729" cor={COR.azul} marcador={azul} />
      <text x={868} y={262} textAnchor="end" className="fill-gelo-300 text-[13px]">sensores próprios</text>

      {/* o envio de dados: só sai */}
      <No base={base} x={250} y={315} largura={200} altura={60} titulo="FIWARE" detalhe="estado e histórico" />
      <No base={base} x={15} y={315} largura={200} altura={60} titulo="Site" detalhe="só leitura" />
      <Seta d="M522 345 H454" cor={COR.azul} marcador={azul} />
      <text x={488} y={333} textAnchor="middle" className="fill-led-forte text-[13px] font-semibold">só envia</text>
      <Seta d="M247 345 H219" cor={COR.azul} marcador={azul} />
      <text x={233} y={333} textAnchor="middle" className="fill-gelo-300 text-[13px]">https</text>

      {/* o C-Shield não escuta a rede: a linha da internet termina num X */}
      <Seta d="M115 168 V252 H488" cor={COR.vermelho} tracejada corre />
      <g filter={`url(#${base}-brilho-vermelho)`}>
        <path d="M490 240 L512 262 M512 240 L490 262" stroke={COR.vermelho} strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <text x={300} y={242} textAnchor="middle" className="fill-ataque text-[14px] font-semibold">não escuta a rede</text>

      {/* a liberação é presencial: só o botão físico libera */}
      <No base={base} x={535} y={410} largura={180} altura={50} titulo="Botão no aparelho" detalhe="físico, só ele libera" />
      <Seta d="M625 408 V394" cor={COR.neutro} marcador={neutro} />
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

// Bordas das caixas do desenho de celular, com as mesmas cores do desenho largo.
const CLASSE_NO = {
  perigo: 'border-ataque/80 bg-ataque/10 shadow-[0_0_18px_rgba(255,64,88,0.3)]',
  seguro: 'border-ok/80 bg-ok/10 shadow-[0_0_18px_rgba(0,229,155,0.3)]',
  destaque: 'border-led-forte bg-led-forte/12 shadow-[0_0_22px_rgba(0,207,255,0.4)]',
  neutro: 'border-gelo-azul/40 bg-noite-900',
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
            className={`w-full rounded-2xl border px-4 py-3 text-center ${CLASSE_NO[no.tipo ?? 'neutro']}`}
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
          { nome: 'Internet', detalhe: 'atacante ou técnico', tipo: 'perigo' },
          { nome: 'Controlador comercial', detalhe: 'vulnerável', tipo: 'perigo', seta: 'text-ataque' },
          { nome: 'Relé do C-Shield', detalhe: 'corta ou libera', tipo: 'seguro' },
          { nome: 'Câmara fria', detalhe: 'compressor e degelo' },
        ]}
      />
      <Cadeia
        titulo="O caminho do C-Shield: só envia"
        nos={[
          { nome: 'Sensores próprios', detalhe: 'dentro da câmara' },
          { nome: 'C-Shield (ESP32)', detalhe: 'decide e veta pelo relé', tipo: 'destaque', seta: 'text-led-forte' },
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
        </span> Só o botão físico do aparelho libera o bloqueio.
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
