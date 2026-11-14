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
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'

// "Os cinco estados": uma lista compacta, uma linha por estado, com a cor do LED (e o que ela quer
// dizer, em texto), o nome e quando o estado acontece. O bloqueio é azul fixo, como o LED do
// aparelho. O LED amarelo piscando pisca devagar e para com prefers-reduced-motion (LedEstado).
export default function SecaoEstados({ estados }) {
  return (
    <Secao
      id="titulo-estados"
      rotulo="Estados"
      titulo="Os cinco estados"
      subtitulo="O aparelho está sempre em um destes estados. O mais grave vale primeiro: crítico, bloqueio, falha de sensor, atenção e normal."
    >
      <div className="nevoa-texto">
      <Revelar>
        <ul className="divide-y divide-borda border-y border-borda">
          {estados.map((estado) => (
            <li
              key={estado.id}
              className="grid gap-x-8 gap-y-2 py-5 md:grid-cols-[18rem_8rem_1fr] md:items-center"
            >
              <LedEstado cor={estado.led} />
              <h3 className="text-lg font-semibold text-gelo-50">{estado.nome}</h3>
              <p className="text-gelo-300">{estado.quando}</p>
            </li>
          ))}
        </ul>
      </Revelar>
      </div>
    </Secao>
  )
}
