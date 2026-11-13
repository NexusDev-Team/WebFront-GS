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

import LinkSeta from '../ui/LinkSeta.jsx'
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'

// "De onde vem a ideia": as duas ideias da indústria (separar o controle da proteção e os diodos
// de dados) e o limite honesto do protótipo, para a banca ver que não é invenção. Seção lisa.
export default function SecaoOrigem({ conteudo }) {
  return (
    <Secao id="titulo-origem" ancora={conteudo.id} rotulo="Origem" titulo={conteudo.titulo} subtitulo={conteudo.subtitulo}>
      <div className="flex flex-col gap-10">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          {conteudo.itens.map((item, indice) => (
            <Revelar key={item.titulo} atraso={indice * 0.1}>
              <article className="flex h-full flex-col gap-3 border-t border-borda pt-8">
                <h3 className="text-xl font-semibold text-gelo-50">{item.titulo}</h3>
                <p className="text-gelo-300">{item.texto}</p>
              </article>
            </Revelar>
          ))}
        </div>

        <Revelar>
          <article className="flex flex-col gap-2 rounded-2xl border border-atencao/40 bg-atencao/5 p-6">
            <h3 className="text-lg font-bold text-gelo-50">{conteudo.limite.titulo}</h3>
            <p className="max-w-prose text-gelo-50">{conteudo.limite.texto}</p>
          </article>
        </Revelar>

        <LinkSeta to={conteudo.link.para}>{conteudo.link.rotulo}</LinkSeta>
      </div>
    </Secao>
  )
}
