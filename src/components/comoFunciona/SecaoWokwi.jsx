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

// "No simulador Wokwi" (W26c): um texto curto explica que os LEDs laranja, azul e verde e a chave
// "Controlador" são representações (o simulador não tem os equipamentos; no aparelho real eles não
// existem) e dois botões levam ao Wokwi e ao repositório do Edge. Em faixa.
export default function SecaoWokwi({ conteudo }) {
  return (
    <Secao id="titulo-wokwi" ancora={conteudo.id} rotulo="Simulador" titulo={conteudo.titulo} subtitulo={conteudo.texto} faixa>
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
    </Secao>
  )
}
