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

import TituloSecao from '../ui/TituloSecao.jsx'
import DiagramaArquitetura from './DiagramaArquitetura.jsx'

// "Uma direção só": o diagrama da arquitetura e, logo abaixo, a mesma história em texto (a lista
// de etapas é o equivalente do diagrama para leitor de tela e para quem prefere ler).
export default function SecaoArquitetura({ conteudo }) {
  return (
    <section id={conteudo.id} aria-labelledby="titulo-arquitetura" className="border-t border-borda bg-noite-900/50 py-16 sm:py-24">
      <div className="conteudo flex flex-col gap-10">
        <TituloSecao id="titulo-arquitetura" subtitulo={conteudo.subtitulo}>
          {conteudo.titulo}
        </TituloSecao>
        <DiagramaArquitetura descricao={conteudo.descricao} />
        <ol className="grid list-decimal gap-x-10 gap-y-3 pl-6 text-gelo-300 marker:text-led-forte md:grid-cols-2">
          {conteudo.etapas.map((etapa) => (
            <li key={etapa} className="pl-2">
              {etapa}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
