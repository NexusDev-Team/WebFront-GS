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

import BotaoLed from '../ui/BotaoLed.jsx'
import TituloSecao from '../ui/TituloSecao.jsx'

// "No simulador Wokwi" (W26c): explica que os LEDs laranja, azul e verde e a chave "Controlador"
// são representações, porque o simulador não tem os equipamentos. No aparelho real eles não existem.
export default function SecaoWokwi({ conteudo }) {
  return (
    <section id={conteudo.id} aria-labelledby="titulo-wokwi" className="border-t border-borda py-16 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <TituloSecao id="titulo-wokwi" subtitulo={conteudo.subtitulo}>
          {conteudo.titulo}
        </TituloSecao>

        <ul className="grid gap-6 md:grid-cols-2">
          {conteudo.representacoes.map((item) => (
            <li key={item.peca} className="cartao flex flex-col gap-2 p-6">
              <h3 className="text-lg font-bold text-gelo-50">{item.peca}</h3>
              <p className="text-gelo-50">
                <span className="text-gelo-300">Representa </span>
                {item.representa}
              </p>
              <p className="text-sm text-gelo-300">{item.comportamento}</p>
            </li>
          ))}
        </ul>

        <p className="max-w-prose rounded-xl border border-borda bg-noite-900 px-5 py-4 text-gelo-50">{conteudo.nota}</p>

        <div className="flex flex-wrap gap-3">
          {conteudo.links.map((link, indice) => (
            <BotaoLed
              key={link.url}
              as="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variante={indice === 0 ? 'primario' : 'fantasma'}
            >
              {link.rotulo} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (abre em nova aba)</span>
            </BotaoLed>
          ))}
        </div>
      </div>
    </section>
  )
}
