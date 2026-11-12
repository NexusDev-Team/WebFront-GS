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

import LedEstado from '../camara/LedEstado.jsx'
import TituloSecao from '../ui/TituloSecao.jsx'

// "Os cinco estados": um cartão por estado, com a cor do LED (e o que ela quer dizer, em texto),
// quando o estado acontece e o que o aparelho faz. O bloqueio é azul fixo, como o LED do aparelho.
// O LED amarelo piscando pisca devagar e para com prefers-reduced-motion (LedEstado).
export default function SecaoEstados({ estados }) {
  return (
    <section aria-labelledby="titulo-estados" className="border-t border-borda py-16 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <TituloSecao
          id="titulo-estados"
          subtitulo="O aparelho está sempre em um destes cinco estados. A prioridade, do mais grave ao mais leve, é crítico, bloqueio, falha de sensor, atenção e normal."
        >
          Os cinco estados
        </TituloSecao>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {estados.map((estado) => (
            <li key={estado.id} className="cartao flex flex-col gap-4 p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xl font-bold text-gelo-50">{estado.nome}</h3>
                <span className="font-mono text-xs text-gelo-300">{estado.id}</span>
              </div>
              <LedEstado cor={estado.led} />
              <dl className="flex flex-col gap-3 text-sm">
                <div>
                  <dt className="text-gelo-300">Quando acontece</dt>
                  <dd className="text-gelo-50">{estado.quando}</dd>
                </div>
                <div>
                  <dt className="text-gelo-300">O que o aparelho faz</dt>
                  <dd className="text-gelo-50">{estado.acao}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
