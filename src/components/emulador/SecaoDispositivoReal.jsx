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

// Seção "Dispositivo real", no fim do emulador (antes era a página /simulador-real). Por enquanto
// traz o cartão do Wokwi (o aparelho de verdade rodando) e a frase do produto; o painel ao vivo,
// que lê o FIWARE, entra na etapa do dispositivo real. Aqui nada envia ordem ao C-Shield.
import BotaoLed from '../ui/BotaoLed.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import TituloLed from '../ui/TituloLed.jsx'

export const URL_WOKWI = 'https://wokwi.com/projects/480328417992209409'

export default function SecaoDispositivoReal() {
  return (
    <PainelVidro as="section" id="dispositivo-real" aria-labelledby="titulo-real" className="flex scroll-mt-24 flex-col gap-4 p-5 sm:p-8">
      <TituloLed nivel={2} variante="assumiu">
        <span id="titulo-real">Dispositivo real</span>
      </TituloLed>
      <p className="max-w-prose text-gelo-50">
        Tudo acima é um jogo. O C-Shield de verdade roda num ESP32; aqui ele roda no simulador Wokwi,
        medindo, decidindo e mandando os dados para a central.
      </p>
      <p className="max-w-prose text-gelo-300">
        Nem este site consegue dar ordens ao C-Shield. Ele só envia dados, e só quem está presente
        consegue liberar o bloqueio.
      </p>
      <p className="text-gelo-300">O painel ao vivo, com a temperatura do aparelho de verdade, chega na próxima etapa.</p>
      <div>
        <BotaoLed
          as="a"
          href={URL_WOKWI}
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel="Abrir o C-Shield no simulador Wokwi (abre em nova aba)"
        >
          Abrir o Wokwi <span aria-hidden="true">↗</span>
        </BotaoLed>
      </div>
    </PainelVidro>
  )
}
