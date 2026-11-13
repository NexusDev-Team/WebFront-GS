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

// Um número do problema: o valor grande (algarismos de largura fixa), o que ele significa e a fonte
// (a notícia de onde vem, com link). `fonte` é a notícia de content/noticias.js. Sem cartão:
// só um fio fino no topo, para sobrar espaço vazio.
export default function FatoNumero({ valor, rotulo, fonte, atraso = 0 }) {
  return (
    <Revelar atraso={atraso}>
      <article className="flex h-full flex-col gap-4 border-t border-borda pt-8">
        <p className="font-titulo text-[clamp(3rem,6vw,4.75rem)] leading-none font-semibold tracking-tight text-gelo-50 tabular-nums">
          {valor}
        </p>
        <p className="text-lg text-gelo-300">{rotulo}</p>
        {fonte && (
          <a
            href={fonte.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-11 items-center font-mono text-xs tracking-wider text-gelo-azul uppercase underline-offset-4 hover:underline"
          >
            Fonte: {fonte.veiculo}
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        )}
      </article>
    </Revelar>
  )
}
