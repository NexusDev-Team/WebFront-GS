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
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'

// "No simulador Wokwi" (W26c): explica que os LEDs laranja, azul e verde e a chave "Controlador"
// são representações, porque o simulador não tem os equipamentos. No aparelho real eles não existem.
// Em faixa.
export default function SecaoWokwi({ conteudo }) {
  return (
    <Secao
      id="titulo-wokwi"
      ancora={conteudo.id}
      rotulo="Simulador"
      titulo={conteudo.titulo}
      subtitulo={conteudo.subtitulo}
      faixa
    >
      <div className="flex flex-col gap-10">
        <ul className="grid gap-6 md:grid-cols-2">
          {conteudo.representacoes.map((item, indice) => (
            <li key={item.peca}>
              <Revelar atraso={(indice % 2) * 0.08} className="h-full">
                <div className="cartao flex h-full flex-col gap-2 p-6">
                  <h3 className="text-lg font-bold text-gelo-50">{item.peca}</h3>
                  <p className="text-gelo-50">
                    <span className="text-gelo-300">Representa </span>
                    {item.representa}
                  </p>
                  <p className="text-sm text-gelo-300">{item.comportamento}</p>
                </div>
              </Revelar>
            </li>
          ))}
        </ul>

        <Revelar>
          <p className="max-w-prose border-l-2 border-ciano pl-5 text-gelo-50">{conteudo.nota}</p>
        </Revelar>

        <Revelar className="flex flex-wrap gap-3">
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
        </Revelar>
      </div>
    </Secao>
  )
}
