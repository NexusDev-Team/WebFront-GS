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

// Rótulo no estilo de terminal: o que vem da rede e do hacker. O cursor pisca a 1 Hz
// e para com prefers-reduced-motion. O ">" é decoração e fica fora da leitura de tela.
export default function PromptTerminal({ cursor = false, className = '', children }) {
  return (
    <p className={`font-mono text-sm text-gelo-300 ${cursor ? 'cursor-terminal' : ''} ${className}`}>
      <span aria-hidden="true" className="mr-2 text-led-forte">
        &gt;
      </span>
      {children}
    </p>
  )
}
