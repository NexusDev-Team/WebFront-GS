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

import { Link } from 'react-router-dom'
import TituloLed from '../ui/TituloLed.jsx'
import PassoSolucao from './PassoSolucao.jsx'

// Seção "a solução": a frase do produto e os quatro passos (medir, decidir, assumir, alertar).
export default function SecaoSolucao({ conteudo }) {
  return (
    <section aria-labelledby="titulo-solucao" className="border-t border-borda bg-noite-900 py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <div className="flex max-w-2xl flex-col gap-4">
          <TituloLed nivel={2} variante="assumiu">
            <span id="titulo-solucao">{conteudo.titulo}</span>
          </TituloLed>
          <p className="text-lg text-gelo-300">{conteudo.texto}</p>
        </div>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {conteudo.passos.map((passo) => (
            <PassoSolucao key={passo.numero} {...passo} />
          ))}
        </ol>

        <Link
          to={conteudo.link.para}
          className="inline-flex min-h-11 items-center font-semibold text-led-forte underline-offset-4 hover:underline"
        >
          {conteudo.link.rotulo}
        </Link>
      </div>
    </section>
  )
}
