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
import { fonteDoFato } from '../../content/inicio.js'
import TituloLed from '../ui/TituloLed.jsx'
import FatoNumero from './FatoNumero.jsx'

// Seção "o problema": o que aconteceu na Europa, em um parágrafo e três números com fonte.
export default function SecaoProblema({ conteudo }) {
  return (
    <section aria-labelledby="titulo-problema" className="border-t border-borda py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <div className="flex max-w-2xl flex-col gap-4">
          <TituloLed nivel={2}>
            <span id="titulo-problema">{conteudo.titulo}</span>
          </TituloLed>
          <p className="text-lg text-gelo-300">{conteudo.texto}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {conteudo.fatos.map((fato) => (
            <FatoNumero key={fato.fonteId} valor={fato.valor} rotulo={fato.rotulo} fonte={fonteDoFato(fato)} />
          ))}
        </div>

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
