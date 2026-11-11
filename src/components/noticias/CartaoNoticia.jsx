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

// Cartão de uma notícia na grade: veículo e data no chapéu, manchete, resumo da equipe e o link
// para a matéria original em nova aba. Etiquetas dizem quando a matéria é em inglês e quando o
// título é da equipe (não foi possível conferir na fonte).
import BotaoLed from '../ui/BotaoLed.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import { formatarDataLonga } from './formato.js'

function Etiqueta({ children }) {
  return (
    <span className="rounded-full border border-borda bg-noite-900 px-2 py-0.5 font-mono text-xs text-gelo-300">
      {children}
    </span>
  )
}

export default function CartaoNoticia({ noticia: n }) {
  return (
    <PainelVidro as="article" className="flex h-full flex-col gap-3 p-5">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-gelo-300">
        <span className="font-semibold text-gelo-50">{n.veiculo}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={n.data}>{formatarDataLonga(n.data)}</time>
      </p>
      <h3 className="text-xl leading-snug font-semibold text-gelo-50">{n.manchete}</h3>
      <p className="text-gelo-300">{n.resumo}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        <BotaoLed
          as="a"
          variante="fantasma"
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel={`Ler a matéria no ${n.veiculo} (abre em nova aba)`}
        >
          Ler na fonte <span aria-hidden="true">↗</span>
        </BotaoLed>
        {n.idioma === 'en' ? <Etiqueta>Em inglês</Etiqueta> : null}
        {n.manchetePublicada ? null : <Etiqueta>Título da equipe</Etiqueta>}
      </div>
    </PainelVidro>
  )
}
