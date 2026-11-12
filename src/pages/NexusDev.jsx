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

import Pagina from '../components/ui/Pagina.jsx'

// Página Nexus Dev: quem fez o C-Shield. Os cinco integrantes (foto, nome, função e RM), a visão
// e a cultura da equipe e um resumo da GS 2026.2. Textos em src/content (rascunho para a
// equipe revisar).
import CartaoIntegrante from '../components/equipe/CartaoIntegrante.jsx'
import PainelVidro from '../components/ui/PainelVidro.jsx'
import Rotulo from '../components/ui/Rotulo.jsx'
import TituloLed from '../components/ui/TituloLed.jsx'
import { EQUIPE } from '../content/equipe.js'
import { CULTURA, SOBRE_GS, VISAO } from '../content/nexusDev.js'

export default function NexusDev() {
  return (
    <Pagina className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <Rotulo>A equipe</Rotulo>
        <TituloLed nivel={1} variante="assumiu">
          Nexus Dev
        </TituloLed>
        <p className="max-w-2xl text-lg text-gelo-300">
          Somos cinco estudantes de Engenharia de Software da FIAP, no primeiro ano, e fizemos o
          C-Shield para a Global Solution 2026.2.
        </p>
      </header>

      <section aria-labelledby="integrantes" className="flex flex-col gap-4">
        <TituloLed nivel={2}>
          <span id="integrantes">Quem faz o C-Shield</span>
        </TituloLed>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPE.map((m) => (
            <li key={m.rm}>
              <CartaoIntegrante integrante={m} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="visao" className="flex flex-col gap-4">
        <TituloLed nivel={2}>
          <span id="visao">Nossa visão</span>
        </TituloLed>
        <PainelVidro className="p-6 sm:p-8">
          <p className="max-w-3xl text-xl leading-relaxed text-gelo-50">{VISAO}</p>
        </PainelVidro>
      </section>

      <section aria-labelledby="cultura" className="flex flex-col gap-4">
        <TituloLed nivel={2}>
          <span id="cultura">Nossa cultura</span>
        </TituloLed>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CULTURA.map((c) => (
            <li key={c.titulo}>
              <PainelVidro as="article" className="flex h-full flex-col gap-2 p-5">
                <h3 className="text-lg font-semibold text-gelo-50">{c.titulo}</h3>
                <p className="text-gelo-300">{c.texto}</p>
              </PainelVidro>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sobre-gs" className="flex flex-col gap-4">
        <TituloLed nivel={2}>
          <span id="sobre-gs">Sobre a GS 2026.2</span>
        </TituloLed>
        <div className="flex max-w-3xl flex-col gap-4">
          {SOBRE_GS.map((paragrafo) => (
            <p key={paragrafo.slice(0, 24)} className="max-w-prose text-lg text-gelo-50">
              {paragrafo}
            </p>
          ))}
        </div>
      </section>
    </Pagina>
  )
}
