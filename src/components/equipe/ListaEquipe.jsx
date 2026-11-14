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

import { useState } from 'react'
import { EQUIPE } from '../../content/equipe.js'

// Avatar redondo da pessoa: a foto recortada no rosto (public/equipe, 256 px, object-cover para
// preencher o círculo) e, se o arquivo não carregar, as iniciais. A foto é decorativa: o nome já
// está escrito ao lado, então o alt fica vazio.
function Avatar({ pessoa }) {
  const [falhou, setFalhou] = useState(false)
  return (
    <span
      aria-hidden={falhou ? 'true' : undefined}
      className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-borda bg-superficie font-mono text-xs text-gelo-azul"
    >
      {falhou ? (
        pessoa.iniciais
      ) : (
        <img
          src={pessoa.foto}
          alt=""
          loading="lazy"
          width="48"
          height="48"
          onError={() => setFalhou(true)}
          className="size-full object-cover"
        />
      )}
    </span>
  )
}

// Lista da equipe (página Nexus Dev): avatar com a foto, nome e RM, separados por fios finos,
// sem cartões. Nomes, RMs e fotos vêm de content/equipe.js. `comFuncao` mostra também a função de
// cada pessoa no projeto (hoje nenhuma página usa).
export default function ListaEquipe({ comFuncao = false }) {
  return (
    <ul className="divide-y divide-borda border-y border-borda">
      {EQUIPE.map((pessoa) => (
        <li key={pessoa.rm} className="flex items-center justify-between gap-4 py-3">
          <span className="flex items-center gap-4">
            <Avatar pessoa={pessoa} />
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
