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

import PassoSolucao from '../inicio/PassoSolucao.jsx'
import TituloSecao from '../ui/TituloSecao.jsx'

// "O ciclo de proteção": os quatro verbos (medir, decidir, assumir, alertar), com o texto completo.
// Reaproveita o cartão numerado da página inicial.
export default function SecaoCiclo({ conteudo }) {
  return (
    <section id={conteudo.id} aria-labelledby="titulo-ciclo" className="py-16 sm:py-24">
      <div className="conteudo flex flex-col gap-10">
        <TituloSecao id="titulo-ciclo" subtitulo={conteudo.subtitulo}>
          {conteudo.titulo}
        </TituloSecao>
        <ol className="grid gap-6 sm:grid-cols-2">
          {conteudo.passos.map((passo) => (
            <PassoSolucao key={passo.numero} {...passo} />
          ))}
        </ol>
      </div>
    </section>
  )
}
