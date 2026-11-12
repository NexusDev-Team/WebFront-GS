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
import TituloSecao from '../ui/TituloSecao.jsx'

// "De onde vem a ideia": as duas ideias da indústria (separar o controle da proteção e os diodos
// de dados) e o limite honesto do protótipo, para a banca ver que não é invenção.
export default function SecaoOrigem({ conteudo }) {
  return (
    <section id={conteudo.id} aria-labelledby="titulo-origem" className="border-t border-borda bg-noite-900/50 py-16 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <TituloSecao id="titulo-origem" subtitulo={conteudo.subtitulo}>
          {conteudo.titulo}
        </TituloSecao>

        <div className="grid gap-6 md:grid-cols-2">
          {conteudo.itens.map((item) => (
            <article key={item.titulo} className="cartao flex flex-col gap-3 p-6">
              <h3 className="text-xl font-bold text-gelo-50">{item.titulo}</h3>
              <p className="text-gelo-300">{item.texto}</p>
            </article>
          ))}
        </div>

        <article className="flex flex-col gap-2 rounded-2xl border border-atencao/40 bg-atencao/5 p-6">
          <h3 className="text-lg font-bold text-gelo-50">{conteudo.limite.titulo}</h3>
          <p className="max-w-prose text-gelo-50">{conteudo.limite.texto}</p>
        </article>

        <Link
          to={conteudo.link.para}
          className="inline-flex min-h-11 w-fit items-center font-semibold text-led-forte underline-offset-4 hover:underline"
        >
          {conteudo.link.rotulo}
        </Link>
      </div>
    </section>
  )
}
