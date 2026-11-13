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

import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'
import DiagramaArquitetura from './DiagramaArquitetura.jsx'

// "Uma direção só": o diagrama da arquitetura e, logo abaixo, a mesma história em texto (a lista
// de etapas é o equivalente do diagrama para leitor de tela e para quem prefere ler) e a nota
// honesta do limite do protótipo. Em faixa.
export default function SecaoArquitetura({ conteudo }) {
  return (
    <Secao
      id="titulo-arquitetura"
      ancora={conteudo.id}
      rotulo="Arquitetura"
      titulo={conteudo.titulo}
      subtitulo={conteudo.subtitulo}
      faixa
    >
      <div className="flex flex-col gap-10">
        <Revelar>
          <DiagramaArquitetura descricao={conteudo.descricao} />
        </Revelar>
        <Revelar atraso={0.1}>
          <ol className="grid list-decimal gap-x-10 gap-y-3 pl-6 text-gelo-300 marker:text-led-forte md:grid-cols-2">
            {conteudo.etapas.map((etapa) => (
              <li key={etapa} className="pl-2">
                {etapa}
              </li>
            ))}
          </ol>
        </Revelar>
        <Revelar atraso={0.15}>
          <p className="max-w-prose text-sm text-gelo-300">{conteudo.limite}</p>
        </Revelar>
      </div>
    </Secao>
  )
}
