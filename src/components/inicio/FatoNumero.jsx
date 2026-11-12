/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Vision. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */

import PainelVidro from '../ui/PainelVidro.jsx'

// Um número do problema: o valor grande em fonte monoespaçada, o que ele significa e a fonte
// (a notícia de onde vem, com link). `fonte` é a notícia de content/noticias.js.
export default function FatoNumero({ valor, rotulo, fonte }) {
  return (
    <PainelVidro as="article" className="flex flex-col gap-4 p-6 sm:p-8">
      <p className="font-mono text-5xl font-medium tracking-tight text-gelo-50 tabular-nums">{valor}</p>
      <p className="text-gelo-300">{rotulo}</p>
      {fonte && (
        <a
          href={fonte.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex min-h-11 items-center text-sm text-led-forte underline-offset-4 hover:underline"
        >
          Fonte: {fonte.veiculo}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      )}
    </PainelVidro>
  )
}
