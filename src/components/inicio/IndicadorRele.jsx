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

// Indicador de um relé, no formato de interruptor do mockup, mas SÓ DE LEITURA: não é botão, não
// recebe foco e não responde a clique (o site nunca dá ordens ao C-Shield). O estado vem em texto
// ("desligada", "liberado") e na posição da bolinha, nunca só pela cor.
export default function IndicadorRele({ nome, estado, ligado }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-gelo-50">{nome}</span>
        <span className="text-sm text-gelo-300">{estado}</span>
      </div>
      <span
        aria-hidden="true"
        className={`pointer-events-none relative h-7 w-12 shrink-0 cursor-default rounded-full border ${
          ligado ? 'border-led-forte bg-led-forte/40' : 'border-borda bg-noite-950'
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full ${ligado ? 'right-0.5 bg-gelo-50' : 'left-0.5 bg-gelo-300'}`}
        />
      </span>
    </li>
  )
}
