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

import IconePasso from './IconePasso.jsx'

// Um passo de como o C-Shield protege. O número existe porque os passos são uma sequência real.
export default function PassoSolucao({ numero, verbo, texto, icone }) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-borda bg-noite-950 p-6">
      <div className="flex items-center justify-between">
        <IconePasso nome={icone} className="size-8 text-led-forte" />
        <span className="font-mono text-sm text-gelo-300" aria-hidden="true">
          {numero}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gelo-50">{verbo}</h3>
      <p className="text-gelo-300">{texto}</p>
    </li>
  )
}
