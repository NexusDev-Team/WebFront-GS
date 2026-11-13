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

import { EQUIPE } from '../../content/equipe.js'

// Lista da equipe (usada na página inicial e na página Nexus Dev): avatar com as iniciais, nome e
// RM, separados por fios finos, sem cartões. Nomes e RMs vêm de content/equipe.js. `comFuncao`
// mostra também a função de cada pessoa no projeto (só a página Nexus Dev usa).
export default function ListaEquipe({ comFuncao = false }) {
  return (
    <ul className="divide-y divide-borda border-y border-borda">
      {EQUIPE.map((pessoa) => (
        <li key={pessoa.rm} className="flex items-center justify-between gap-4 py-4">
          <span className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-borda bg-superficie font-mono text-xs text-gelo-azul"
            >
              {pessoa.iniciais}
            </span>
            <span className="flex flex-col">
              <span className="text-gelo-50">{pessoa.nome}</span>
              {comFuncao ? <span className="text-sm text-gelo-300">{pessoa.funcao}</span> : null}
            </span>
          </span>
          <span className="font-mono text-xs tracking-wider text-gelo-300">{pessoa.rm}</span>
        </li>
      ))}
    </ul>
  )
}
