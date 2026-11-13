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

import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Secao from '../ui/Secao.jsx'
import PassoSolucao from './PassoSolucao.jsx'

// Seção "como funciona": a frase do produto e os quatro passos (medir, decidir, assumir, alertar),
// ligados por uma linha de circuito. O dispositivo não recebe comando pela rede e só destrava
// presencialmente (por isso o texto fala em "ignorar ordens" e "liberar de perto").
export default function SecaoSolucao({ conteudo }) {
  return (
    <Secao
      id="titulo-solucao"
      ancora="como-funciona"
      rotulo="Como funciona"
      titulo={conteudo.titulo}
      subtitulo={conteudo.texto}
      className="border-y border-borda/50 bg-noite-900/60"
    >
      <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {conteudo.passos.map((passo, indice) => (
          <PassoSolucao
            key={passo.numero}
            {...passo}
            atraso={indice * 0.12}
            ultimo={indice === conteudo.passos.length - 1}
          />
        ))}
      </ol>

      <Link
        to={conteudo.link.para}
        className="group mt-14 inline-flex min-h-11 items-center gap-2 font-semibold text-ciano underline-offset-4 hover:underline"
      >
        {conteudo.link.rotulo}
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-suave motion-safe:group-hover:translate-x-1"
        />
      </Link>
    </Secao>
  )
}
