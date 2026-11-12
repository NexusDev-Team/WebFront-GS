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

// Título de seção no estilo do mockup: caixa alta, peso forte e espaçamento entre letras.
// Só para as seções da página inicial e do Como funciona; os h1 continuam em caixa normal.
// `id` liga o título à seção (aria-labelledby). `subtitulo` é opcional.
export default function TituloSecao({ id, subtitulo, className = '', children }) {
  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${className}`}>
      <h2 id={id} className="text-lg font-bold tracking-wide text-gelo-50 uppercase sm:text-xl">
        {children}
      </h2>
      {subtitulo ? <p className="text-gelo-300">{subtitulo}</p> : null}
    </div>
  )
}
