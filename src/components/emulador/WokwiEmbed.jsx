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

// Circuito do C-Shield no simulador Wokwi, embutido na página. O Wokwi aceita iframe (conferido
// em 12/11). Abaixo do quadro fica o link para abrir o projeto em nova aba, caso o quadro seja
// pequeno demais ou o Wokwi demore a carregar. Aqui nada envia ordem ao C-Shield.
import BotaoLed from '../ui/BotaoLed.jsx'

export default function WokwiEmbed({ url }) {
  return (
    <div className="flex flex-col gap-3">
      <iframe
        src={url}
        title="Circuito do C-Shield no simulador Wokwi"
        loading="lazy"
        className="aspect-video w-full rounded-lg border border-borda bg-noite-900"
      />
      <div>
        <BotaoLed
          as="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          variante="fantasma"
          ariaLabel="Abrir o C-Shield no simulador Wokwi (abre em nova aba)"
        >
          Abrir o Wokwi <span aria-hidden="true">↗</span>
        </BotaoLed>
      </div>
    </div>
  )
}
