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

// A manchete de capa da página Notícias: grande, no estilo de portal, com a ilustração própria.
import BotaoLed from '../ui/BotaoLed.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import { formatarDataLonga } from './formato.js'
import IlustracaoGeladeira from './IlustracaoGeladeira.jsx'

export default function ManchetePrincipal({ noticia: n }) {
  return (
    <PainelVidro as="article" scanlines className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-sm text-gelo-300">
          <span className="font-semibold text-ataque">MANCHETE</span>
          <span aria-hidden="true"> · </span>
          {n.veiculo}
          <span aria-hidden="true"> · </span>
          <time dateTime={n.data}>{formatarDataLonga(n.data)}</time>
        </p>
        <h2 className="text-3xl leading-tight font-bold text-gelo-50 sm:text-4xl">{n.manchete}</h2>
        <p className="max-w-prose text-lg text-gelo-50">{n.resumo}</p>
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
      </div>
      <IlustracaoGeladeira className="mx-auto w-full max-w-xs" />
    </PainelVidro>
  )
}
