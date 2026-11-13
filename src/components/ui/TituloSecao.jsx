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

// Título de seção das páginas internas (Como funciona, emulador...), no mesmo estilo do título do
// componente Secao: Space Grotesk, de 30 a 48 px, semibold e entrelinha curta.
// `id` liga o título à seção (aria-labelledby). `subtitulo` é opcional.
export default function TituloSecao({ id, subtitulo, className = '', children }) {
  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${className}`}>
      <h2 id={id} className="text-[clamp(1.875rem,3.5vw,3rem)] leading-[1.1] font-semibold text-balance text-gelo-50">
        {children}
      </h2>
      {subtitulo ? <p className="text-base leading-relaxed text-gelo-300 sm:text-lg">{subtitulo}</p> : null}
    </div>
  )
}
