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

// Pílulas com as tecnologias do projeto (página inicial e página Nexus Dev). A lista vem de
// NEXUS.tecnologias em content/inicio.js, a única fonte.
export default function ListaTecnologias({ tecnologias }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {tecnologias.map((tecnologia) => (
        <li key={tecnologia} className="rounded-full border border-borda px-4 py-1.5 font-mono text-sm text-gelo-100">
          {tecnologia}
        </li>
      ))}
    </ul>
  )
}
