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

import ListaEquipe from '../equipe/ListaEquipe.jsx'
import LinkSeta from '../ui/LinkSeta.jsx'
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'

// Prévia da equipe na página inicial: o propósito, as tecnologias e os cinco integrantes (ListaEquipe,
// a mesma lista da página Nexus Dev). Sem cartões: uma lista com
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
          <ListaEquipe />
        </Revelar>
      </div>
    </Secao>
  )
}
