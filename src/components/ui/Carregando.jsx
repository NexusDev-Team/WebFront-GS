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

// Aviso de carregamento. role="status" anuncia a espera a leitores de tela.
export default function Carregando({ texto = 'Carregando...' }) {
  return (
    <p role="status" className="cursor-terminal font-mono text-gelo-300">
      {'> '}
      {texto}
    </p>
  )
}
