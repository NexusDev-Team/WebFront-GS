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

// A manchete de capa da página Notícias: texto largo, no estilo de portal, sem imagem. Em vez de
// cartão, um fio fino no topo (como os números da página inicial), para sobrar espaço vazio.
import BotaoLed from '../ui/BotaoLed.jsx'
import { formatarDataLonga } from './formato.js'

export default function ManchetePrincipal({ noticia: n }) {
  return (
    <article className="flex max-w-4xl flex-col gap-6 border-t border-borda pt-8">
      <p className="font-mono text-sm text-gelo-300">
        <span className="font-semibold text-ataque">MANCHETE</span>
        <span aria-hidden="true"> · </span>
        {n.veiculo}
        <span aria-hidden="true"> · </span>
        <time dateTime={n.data}>{formatarDataLonga(n.data)}</time>
      </p>
      <h2 className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-bold tracking-tight text-balance text-gelo-50">
        {n.manchete}
      </h2>
      <p className="max-w-prose text-lg text-gelo-100 sm:text-xl">{n.resumo}</p>
      <div>
        <BotaoLed
          as="a"
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel={`Ler a matéria completa no ${n.veiculo} (abre em nova aba)`}
        >
          Ler na fonte <span aria-hidden="true">↗</span>
        </BotaoLed>
      </div>
    </article>
  )
}
