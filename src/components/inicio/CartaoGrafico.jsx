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

import GraficoArea from '../graficos/GraficoArea.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import { formatarGraus } from '../ui/formato.js'

// Cartão do gráfico de temperatura, como no mockup: o título, a pílula "em tempo real" (aqui
// "simulado", porque a página inicial usa dados fictícios) e o gráfico de área com a linha do
// limite da faixa segura.
export default function CartaoGrafico({ temperaturas, nome, limiteMax }) {
  return (
    <PainelVidro as="article" className="flex flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-gelo-50">Temperatura</h3>
        <p className="inline-flex items-center gap-2 rounded-full border border-borda bg-noite-950 px-3 py-1 text-sm text-gelo-300">
          <span aria-hidden="true" className="size-2 rounded-full bg-ciano" />
          Em tempo real · simulado
        </p>
      </div>
      <GraficoArea
        temperaturas={temperaturas}
        titulo={`Temperatura da ${nome.toLowerCase()}`}
        limite={{ valor: limiteMax, rotulo: `limite ${formatarGraus(limiteMax)} °C` }}
        altura={260}
      />
    </PainelVidro>
  )
}
