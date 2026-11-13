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
import LinkSeta from '../ui/LinkSeta.jsx'
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'

// Prévia da equipe na página inicial: o propósito, as tecnologias e os cinco integrantes (nomes e
// RMs vêm de content/equipe.js, a mesma fonte da página Nexus Dev). Sem cartões: uma lista com
// fios finos, e o link leva à página completa.
export default function SecaoNexusDev({ conteudo }) {
  return (
    <Secao
      id="titulo-nexus"
      ancora="nexus-dev"
      rotulo={conteudo.rotulo}
      titulo={conteudo.titulo}
      subtitulo={conteudo.texto}
      faixa
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Revelar className="flex flex-col items-start gap-8">
          <div>
            <p className="rotulo-tecnico mb-4">Tecnologias</p>
            <ul className="flex flex-wrap gap-3">
              {conteudo.tecnologias.map((tecnologia) => (
                <li
                  key={tecnologia}
                  className="rounded-full border border-borda px-4 py-1.5 font-mono text-sm text-gelo-100"
                >
                  {tecnologia}
                </li>
              ))}
            </ul>
          </div>
          <LinkSeta to={conteudo.link.para}>{conteudo.link.rotulo}</LinkSeta>
        </Revelar>

        <Revelar atraso={0.1}>
          <p className="rotulo-tecnico mb-4">Integrantes</p>
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
                  <span className="text-gelo-50">{pessoa.nome}</span>
                </span>
                <span className="font-mono text-xs tracking-wider text-gelo-300">{pessoa.rm}</span>
              </li>
            ))}
          </ul>
        </Revelar>
      </div>
    </Secao>
  )
}
