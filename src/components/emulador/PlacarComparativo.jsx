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

// O placar comparativo (W19): as duas UBS lado a lado, uma com C-Shield e outra sem, com a
// temperatura, o tempo até reagir, a exposição ao calor e a situação. Sempre visível e
// atualizado a cada ciclo do jogo. Sem C-Shield, o tempo até reagir é o do caso real: 3h30.
import { formatarReacao } from '../../domain/cidade-placar.js'
import PainelVidro from '../ui/PainelVidro.jsx'
import TituloLed from '../ui/TituloLed.jsx'
import { COR_SITUACAO, ROTULO_SITUACAO } from './rotulos.js'

const num = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function Linha({ rotulo, children }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-borda py-2 last:border-b-0">
      <dt className="text-sm text-gelo-300">{rotulo}</dt>
      <dd className="text-right text-gelo-50">{children}</dd>
    </div>
  )
}

function Coluna({ item }) {
  const reacao = formatarReacao(item)
  return (
    <section
      aria-label={`${item.nome}, ${item.protegido ? 'com' : 'sem'} C-Shield`}
      className="rounded-lg border bg-noite-900 p-3"
      style={{ borderColor: item.protegido ? 'var(--color-led-forte)' : 'var(--color-borda)' }}
    >
      <h3 className="font-semibold text-gelo-50">{item.nome}</h3>
      <p className="mb-1 font-mono text-sm text-gelo-300">{item.protegido ? 'com C-Shield' : 'sem C-Shield'}</p>
      <dl>
        <Linha rotulo="Temperatura">
          <span className="font-mono">{num(item.temperatura)} °C</span>
        </Linha>
        <Linha rotulo="Tempo até reagir">{reacao ?? '—'}</Linha>
        <Linha rotulo="Exposição ao calor">
          <span className="font-mono">{num(item.exposicao)} °C·min</span>
        </Linha>
        <Linha rotulo="Situação">
          <span aria-hidden="true" className="mr-2 inline-block size-2.5 rounded-full" style={{ backgroundColor: COR_SITUACAO[item.situacao] }} />
          {ROTULO_SITUACAO[item.situacao]}
        </Linha>
      </dl>
    </section>
  )
}

export default function PlacarComparativo({ placar }) {
  return (
    <PainelVidro as="section" aria-labelledby="titulo-placar" className="flex flex-col gap-3 p-4 sm:p-6">
      <TituloLed nivel={2}>
        <span id="titulo-placar">Placar</span>
      </TituloLed>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {placar.map((item) => (
          <Coluna key={item.id} item={item} />
        ))}
      </div>
      <p className="font-semibold text-gelo-50">Mesma cidade, mesmo ataque, mesma hora.</p>
    </PainelVidro>
  )
}
