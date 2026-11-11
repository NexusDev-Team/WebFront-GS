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

// Gráfico de temperatura em SVG próprio (sem biblioteca): a linha da temperatura e a faixa segura
// sombreada. A conta das coordenadas está em domain/grafico.js. Serve ao emulador e ao dispositivo
// real. Quando a linha sai da faixa, a cor muda para a de ataque (e o texto abaixo diz o mesmo).
import { escalarGrafico } from '../../domain/grafico.js'

const GEO = { largura: 420, altura: 170 }
const HALO = { paintOrder: 'stroke', stroke: 'var(--color-noite-950)', strokeWidth: 4 }

export default function GraficoTemperatura({ pontos, tMin, tMax }) {
  const g = escalarGrafico(pontos, { tMin, tMax }, GEO)
  const ultima = pontos.length > 0 ? pontos[pontos.length - 1].temperatura : null
  const fora = ultima !== null && (ultima < tMin || ultima > tMax)

  return (
    <figure className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${GEO.largura} ${GEO.altura}`}
        role="img"
        aria-label={`Gráfico da temperatura. Faixa segura de ${tMin} a ${tMax} graus. ${
          ultima === null ? 'Ainda sem dados.' : `Agora: ${ultima.toFixed(1)} graus, ${fora ? 'fora' : 'dentro'} da faixa.`
        }`}
        className="h-auto w-full rounded-lg bg-noite-900"
      >
        <rect x={g.area.x} y={g.faixa.y} width={g.area.largura} height={g.faixa.altura} fill="var(--color-ok)" fillOpacity={0.16} />
        <g stroke="var(--color-borda)" strokeWidth={1} strokeDasharray="4 4">
          <line x1={g.area.x} x2={g.area.x + g.area.largura} y1={g.yTMax} y2={g.yTMax} />
          <line x1={g.area.x} x2={g.area.x + g.area.largura} y1={g.yTMin} y2={g.yTMin} />
        </g>
        <g fontFamily="var(--font-mono)" fontSize={13} fill="var(--color-gelo-50)" textAnchor="end" style={HALO}>
          <text x={g.area.x - 6} y={g.yTMax + 4}>
            {tMax}°
          </text>
          <text x={g.area.x - 6} y={g.yTMin + 4}>
            {tMin}°
          </text>
        </g>
        {g.caminho ? (
          <path d={g.caminho} fill="none" stroke={fora ? 'var(--color-ataque)' : 'var(--color-led-forte)'} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        ) : (
          <text x={GEO.largura / 2} y={GEO.altura / 2} textAnchor="middle" fontSize={14} fill="var(--color-gelo-300)">
            Coletando dados...
          </text>
        )}
      </svg>
      <figcaption className="text-sm text-gelo-300">
        Faixa segura (sombreada): {tMin} °C a {tMax} °C.
        {fora ? ' A temperatura está fora da faixa.' : ''}
      </figcaption>
    </figure>
  )
}
