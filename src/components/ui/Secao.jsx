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

import Revelar from './Revelar.jsx'

// Seção padrão das páginas (Design System v1.0): espaçamento vertical de 96 a 160 px, container
// de 88% (até 1440 px), rótulo técnico, título e subtítulo opcionais, tudo entrando ao rolar.
// `id` liga o título à seção (aria-labelledby); `ancora` é o id da própria seção (links #...). `fundo` é um nó decorativo posto atrás do conteúdo.
export default function Secao({ id, ancora, rotulo, titulo, subtitulo, fundo = null, className = '', children }) {
  return (
    <section
      id={ancora}
      aria-labelledby={titulo ? id : undefined}
      className={`relative scroll-mt-20 py-24 md:py-32 lg:py-40 ${className}`}
    >
      {fundo}
      <div className="relative conteudo">
        {titulo ? (
          <Revelar className="mb-12 flex max-w-3xl flex-col gap-4 md:mb-16">
            {rotulo ? <p className="rotulo-tecnico">{rotulo}</p> : null}
            <h2 id={id} className="text-[clamp(1.875rem,3.5vw,3rem)] leading-[1.1] font-semibold text-balance text-gelo-50">
              {titulo}
            </h2>
            {subtitulo ? <p className="text-base leading-relaxed text-gelo-300 sm:text-lg">{subtitulo}</p> : null}
          </Revelar>
        ) : null}
        {children}
      </div>
    </section>
  )
}
