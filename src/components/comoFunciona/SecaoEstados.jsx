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
import FundoCyber from '../ui/FundoCyber.jsx'
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'

// "Os cinco estados": um cartão por estado, com a cor do LED (e o que ela quer dizer, em texto),
// quando o estado acontece e o que o aparelho faz. O bloqueio é azul fixo, como o LED do aparelho.
// O LED amarelo piscando pisca devagar e para com prefers-reduced-motion (LedEstado).
export default function SecaoEstados({ estados }) {
  return (
    <Secao
      id="titulo-estados"
      rotulo="Estados"
      titulo="Os cinco estados"
      subtitulo="O aparelho está sempre em um destes cinco estados. A prioridade, do mais grave ao mais leve, é crítico, bloqueio, falha de sensor, atenção e normal."
      fundo={<FundoCyber />}
    >
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {estados.map((estado, indice) => (
          <li key={estado.id}>
            <Revelar atraso={(indice % 3) * 0.08} className="h-full">
              <div className="cartao flex h-full flex-col gap-4 p-6">
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
              </div>
            </Revelar>
          </li>
        ))}
      </ul>
    </Secao>
  )
}
