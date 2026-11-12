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

// O placar comparativo (W19), numa tabela compacta: as duas UBS lado a lado, uma com C-Shield e
// outra sem, com a temperatura, o tempo até reagir, a exposição ao calor e a situação. Sempre
// visível e atualizado a cada ciclo do jogo. Sem C-Shield, o tempo até reagir é o do caso real:
// 3h30.
import { formatarReacao } from '../../domain/cidade-placar.js'
import PainelVidro from '../ui/PainelVidro.jsx'
import TituloLed from '../ui/TituloLed.jsx'
import { COR_SITUACAO, ROTULO_SITUACAO } from './rotulos.js'

const num = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export default function PlacarComparativo({ placar }) {
  return (
    <PainelVidro as="section" aria-labelledby="titulo-placar" className="flex flex-col gap-2 p-3 sm:p-4">
      <TituloLed nivel={3}>
        <span id="titulo-placar">Placar</span>
      </TituloLed>
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">Comparação das duas UBS: uma com C-Shield e outra sem</caption>
        <thead>
          <tr>
            <td className="w-[28%]" />
            {placar.map((item) => (
              <th
                key={item.id}
                scope="col"
                className="border-t-2 px-2 pt-2 pb-1 align-top text-sm font-semibold text-gelo-50"
                style={{ borderColor: item.protegido ? 'var(--color-led-forte)' : 'var(--color-borda)' }}
              >
                {item.nome}
                <span className="block font-mono text-xs font-normal text-gelo-300">
                  {item.protegido ? 'com C-Shield' : 'sem C-Shield'}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-gelo-50">
          <tr className="border-t border-borda">
            <th scope="row" className="py-1.5 pr-1 align-top text-xs font-normal text-gelo-300">
              Temperatura
            </th>
            {placar.map((item) => (
              <td key={item.id} className="px-2 py-1.5 align-top font-mono">
                {num(item.temperatura)} °C
              </td>
            ))}
          </tr>
          <tr className="border-t border-borda">
            <th scope="row" className="py-1.5 pr-1 align-top text-xs font-normal text-gelo-300">
              Tempo até reagir
            </th>
            {placar.map((item) => (
              <td key={item.id} className="px-2 py-1.5 align-top">
                {formatarReacao(item) ?? '—'}
              </td>
            ))}
          </tr>
          <tr className="border-t border-borda">
            <th scope="row" className="py-1.5 pr-1 align-top text-xs font-normal text-gelo-300">
              Exposição ao calor
            </th>
            {placar.map((item) => (
              <td key={item.id} className="px-2 py-1.5 align-top font-mono">
                {num(item.exposicao)} °C·min
              </td>
            ))}
          </tr>
          <tr className="border-t border-borda">
            <th scope="row" className="py-1.5 pr-1 align-top text-xs font-normal text-gelo-300">
              Situação
            </th>
            {placar.map((item) => (
              <td key={item.id} className="px-2 py-1.5 align-top">
                <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-full" style={{ backgroundColor: COR_SITUACAO[item.situacao] }} />
                {ROTULO_SITUACAO[item.situacao]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="text-sm font-semibold text-gelo-50">Mesma cidade, mesmo ataque, mesma hora.</p>
    </PainelVidro>
  )
}
