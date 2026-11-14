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
import Secao from '../ui/Secao.jsx'

// "O ciclo de proteção": os quatro verbos (medir, decidir, assumir, alertar), com o texto completo.
// Reaproveita o passo numerado da página inicial.
export default function SecaoCiclo({ conteudo }) {
  return (
    <Secao id="titulo-ciclo" ancora={conteudo.id} rotulo="O ciclo" titulo={conteudo.titulo} subtitulo={conteudo.subtitulo}>
      <ol className="grid gap-10 sm:grid-cols-2 lg:gap-12">
        {conteudo.passos.map((passo, indice) => (
          <PassoSolucao key={passo.numero} {...passo} atraso={indice * 0.08} ultimo />
        ))}
      </ol>
    </Secao>
  )
}
