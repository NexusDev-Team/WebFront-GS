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

import { useId, useState } from 'react'
import { caminhoArea, caminhoSuave, escalarSerie } from '../../domain/grafico.js'
import { useLarguraElemento } from '../../hooks/useLarguraElemento.js'
import { formatarGraus } from '../ui/formato.js'

// Gráfico de área da página inicial: a temperatura de uma câmara ao longo do tempo. SVG próprio,
// sem biblioteca. Uma série só (o título do cartão já a nomeia, por isso sem legenda), linha fina
// de 2 px, grade discreta e o último ponto marcado com um anel da cor do fundo. Ao passar o mouse
// aparece a guia vertical com o valor. Quem usa leitor de tela encontra uma tabela com as mesmas
// leituras. A conta das coordenadas está em domain/grafico.js.
//   temperaturas  as leituras, da mais antiga à mais nova;
//   titulo        o que o gráfico mostra (vai no texto alternativo e na tabela);
//   passoSeg      segundos entre uma leitura e a seguinte;
//   limite        { valor, rotulo } opcional: uma linha tracejada de referência.
function quando(indice, total, passoSeg) {
  const segundos = (total - 1 - indice) * passoSeg
  return segundos === 0 ? 'agora' : `há ${segundos} s`
}

export default function GraficoArea({ temperaturas, titulo, passoSeg = 2, limite = null, altura = 240 }) {
  const [ref, largura] = useLarguraElemento()
  const [ativo, setAtivo] = useState(null)
  const idGradiente = `area-${useId().replace(/:/g, '')}`

  const n = temperaturas.length
  const g = escalarSerie(temperaturas, { largura, altura }, { limite: limite ? limite.valor : null })
  const curva = caminhoSuave(g.pontos)
  const preenchimento = caminhoArea(g.pontos, g.baseY)
  const ultima = g.pontos[n - 1]
  const menor = Math.min(...temperaturas)
  const maior = Math.max(...temperaturas)

  function aoMover(evento) {
    const caixa = evento.currentTarget.getBoundingClientRect()
    const passo = g.area.largura / Math.max(1, n - 1)
    const indice = Math.round((evento.clientX - caixa.left - g.area.x) / passo)
    setAtivo(Math.min(n - 1, Math.max(0, indice)))
  }

  const pontoAtivo = ativo === null ? null : g.pontos[ativo]

  return (
    <figure ref={ref} className="relative w-full">
      <svg
        width={largura}
        height={altura}
        viewBox={`0 0 ${largura} ${altura}`}
        role="img"
        aria-label={`${titulo}. Última leitura ${formatarGraus(temperaturas[n - 1])} graus, entre ${formatarGraus(menor)} e ${formatarGraus(maior)}.`}
        onPointerMove={aoMover}
        onPointerLeave={() => setAtivo(null)}
        className="block"
      >
        <defs>
          <linearGradient id={idGradiente} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-led-forte)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-led-forte)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {g.marcas.map((marca) => (
          <g key={marca.valor}>
            <line
              x1={g.area.x}
              x2={g.area.x + g.area.largura}
              y1={marca.y}
              y2={marca.y}
              stroke="rgba(226, 232, 240, 0.08)"
              strokeWidth="1"
            />
            <text x={g.area.x - 8} y={marca.y + 4} textAnchor="end" className="fill-gelo-300 font-mono text-[11px]">
              {formatarGraus(marca.valor)}
            </text>
          </g>
        ))}

        {limite ? (
          <g>
            <line
              x1={g.area.x}
              x2={g.area.x + g.area.largura}
              y1={g.yDe(limite.valor)}
              y2={g.yDe(limite.valor)}
              stroke="var(--color-gelo-300)"
              strokeOpacity="0.6"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={g.area.x + g.area.largura}
              y={g.yDe(limite.valor) - 6}
              textAnchor="end"
              className="fill-gelo-300 font-mono text-[11px]"
            >
              {limite.rotulo}
            </text>
          </g>
        ) : null}

        <path d={preenchimento} fill={`url(#${idGradiente})`} />
        <path
          d={curva}
          pathLength="1"
          fill="none"
          stroke="var(--color-led-forte)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="desenha"
        />

        <circle cx={ultima.x} cy={ultima.y} r="4.5" fill="var(--color-led-forte)" stroke="var(--color-noite-900)" strokeWidth="2" />

        {[0, Math.floor((n - 1) / 2), n - 1].map((indice, posicao) => (
          <text
            key={indice}
            x={g.pontos[indice].x}
            y={altura - 8}
            textAnchor={posicao === 0 ? 'start' : posicao === 2 ? 'end' : 'middle'}
            className="fill-gelo-300 font-mono text-[11px]"
          >
            {quando(indice, n, passoSeg)}
          </text>
        ))}

        {pontoAtivo ? (
          <g aria-hidden="true">
            <line x1={pontoAtivo.x} x2={pontoAtivo.x} y1={g.area.y} y2={g.baseY} stroke="var(--color-gelo-300)" strokeOpacity="0.4" strokeWidth="1" />
            <circle cx={pontoAtivo.x} cy={pontoAtivo.y} r="5" fill="var(--color-led-forte)" stroke="var(--color-noite-900)" strokeWidth="2" />
          </g>
        ) : null}
      </svg>

      {pontoAtivo ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-borda bg-noite-950 px-3 py-2 font-mono text-sm whitespace-nowrap text-gelo-50"
          style={{ left: Math.min(Math.max(pontoAtivo.x, 56), largura - 56), top: pontoAtivo.y - 12 }}
        >
          <span className="tabular-nums">{formatarGraus(temperaturas[ativo])} °C</span>
          <span className="ml-2 text-gelo-300">{quando(ativo, n, passoSeg)}</span>
        </div>
      ) : null}

      <table className="sr-only">
        <caption>{titulo}: leituras simuladas, da mais antiga à mais nova</caption>
        <thead>
          <tr>
            <th scope="col">Quando</th>
            <th scope="col">Temperatura (°C)</th>
          </tr>
        </thead>
        <tbody>
          {temperaturas.map((temperatura, indice) => (
            <tr key={indice}>
              <td>{quando(indice, n, passoSeg)}</td>
              <td>{formatarGraus(temperatura)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
