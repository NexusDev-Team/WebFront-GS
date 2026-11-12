/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Vision. Integrantes:
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

// Uma métrica: o rótulo pequeno em cima e o valor embaixo.
function Metrica({ rotulo, children }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-gelo-300">{rotulo}</dt>
      <dd className="text-gelo-50">{children}</dd>
    </div>
  )
}

function Coluna({ item }) {
  const reacao = formatarReacao(item)
  return (
    <section
      aria-label={`${item.nome}, ${item.protegido ? 'com' : 'sem'} C-Shield`}
      className="flex flex-col gap-4 rounded-xl border bg-noite-900 p-4"
      style={{ borderColor: item.protegido ? 'var(--color-led-forte)' : 'var(--color-borda)' }}
    >
      <div>
        <h3 className="text-lg font-bold text-gelo-50">{item.nome}</h3>
        <p className="text-sm text-gelo-300">{item.protegido ? 'Com C-Shield' : 'Sem C-Shield'}</p>
      </div>
      <dl className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Metrica rotulo="Temperatura">
          <span className="font-mono text-lg tabular-nums">{num(item.temperatura)} °C</span>
        </Metrica>
        <Metrica rotulo="Tempo até reagir">
          <span className="font-mono text-lg tabular-nums">{reacao ?? '—'}</span>
        </Metrica>
        <Metrica rotulo="Exposição ao calor">
          <span className="font-mono text-lg tabular-nums">{num(item.exposicao)} °C·min</span>
        </Metrica>
        <Metrica rotulo="Situação">
          <span aria-hidden="true" className="mr-2 inline-block size-2.5 rounded-full" style={{ backgroundColor: COR_SITUACAO[item.situacao] }} />
          {ROTULO_SITUACAO[item.situacao]}
        </Metrica>
      </dl>
    </section>
  )
}

export default function PlacarComparativo({ placar }) {
  return (
    <PainelVidro as="section" aria-labelledby="titulo-placar" className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <TituloLed nivel={2}>
          <span id="titulo-placar">Placar</span>
        </TituloLed>
        <p className="font-semibold text-gelo-50">Mesma cidade, mesmo ataque, mesma hora.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {placar.map((item) => (
          <Coluna key={item.id} item={item} />
        ))}
      </div>
    </PainelVidro>
  )
}
