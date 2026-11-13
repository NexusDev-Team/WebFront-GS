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
import { fonteDoFato } from '../../content/inicio.js'
import Secao from '../ui/Secao.jsx'
import FatoNumero from './FatoNumero.jsx'

// Seção "o problema": o que aconteceu na Europa, em um parágrafo e três números com fonte.
// Sem cartões em volta: os números respiram sobre o fundo, separados por um fio fino.
export default function SecaoProblema({ conteudo }) {
  return (
    <Secao
      id="titulo-problema"
      ancora="problema"
      rotulo="O problema"
      titulo={conteudo.titulo}
      subtitulo={conteudo.texto}
    >
      <div className="grid gap-10 md:grid-cols-3 md:gap-12">
        {conteudo.fatos.map((fato, indice) => (
          <FatoNumero
            key={fato.fonteId}
            valor={fato.valor}
            rotulo={fato.rotulo}
            fonte={fonteDoFato(fato)}
            atraso={indice * 0.12}
          />
        ))}
      </div>

      <Link
        to={conteudo.link.para}
        className="group mt-12 inline-flex min-h-11 items-center gap-2 font-semibold text-ciano underline-offset-4 hover:underline"
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
