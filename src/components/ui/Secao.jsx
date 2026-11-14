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

// Seção padrão das páginas (Design System v1.0): espaçamento vertical de 64 a 96 px (padrão único do site), container
// de 88% (até 1440 px), rótulo técnico, título e subtítulo opcionais, tudo entrando ao rolar.
// `id` liga o título à seção (aria-labelledby); `ancora` é o id da própria seção (links #...). `fundo` é um nó decorativo posto atrás do conteúdo.
// Não há fundo por seção: o fundo é uma camada fixa única (FundoAtmosfera), então a rolagem parece uma tela só. `compacta` reduz o respiro vertical
// (usada onde o conteúdo precisa caber na tela, como o jogo do emulador). `rotuloAria` nomeia a
// seção quando ela não tem título visível.
export default function Secao({
  id,
  ancora,
  rotulo,
  titulo,
  subtitulo,
  fundo = null,
  compacta = false,
  rotuloAria,
  className = '',
  children,
}) {
  return (
    <section
      id={ancora}
      aria-labelledby={titulo ? id : undefined}
      aria-label={titulo ? undefined : rotuloAria}
      className={`relative scroll-mt-20 ${compacta ? 'py-12 md:py-16' : 'py-16 md:py-20 lg:py-24'} ${className}`}
    >
      {fundo}
      <div className="relative conteudo">
        {titulo ? (
          <div className="nevoa-texto mb-8 max-w-3xl md:mb-12">
            <Revelar className="flex flex-col gap-4">
              {rotulo ? <p className="rotulo-tecnico">{rotulo}</p> : null}
              <h2 id={id} className="text-[clamp(1.875rem,3.5vw,3rem)] leading-[1.1] font-semibold text-balance text-gelo-50">
                {titulo}
              </h2>
              {subtitulo ? <p className="text-base leading-relaxed text-gelo-300 sm:text-lg">{subtitulo}</p> : null}
            </Revelar>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
