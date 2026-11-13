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
import IconePasso from './IconePasso.jsx'

// Um passo de como o C-Shield protege. O número existe porque os passos são uma sequência real.
// `ultimo` tira a linha de circuito que liga este passo ao próximo (só no desktop).
export default function PassoSolucao({ numero, verbo, texto, icone, atraso = 0, ultimo = false }) {
  return (
    <li>
      <Revelar atraso={atraso} className="flex h-full flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full border border-borda bg-superficie">
            <IconePasso nome={icone} className="size-6 text-ciano" />
          </span>
          {ultimo ? null : (
            <span aria-hidden="true" className="relative hidden h-px flex-1 overflow-hidden bg-borda lg:block">
              <span className="pulso-linha absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent via-ciano to-transparent" />
            </span>
          )}
        </div>
        <p className="font-mono text-xs tracking-widest text-gelo-300" aria-hidden="true">
          {numero}
        </p>
        <h3 className="text-2xl font-semibold text-gelo-50">{verbo}</h3>
        <p className="text-gelo-300">{texto}</p>
      </Revelar>
    </li>
  )
}
