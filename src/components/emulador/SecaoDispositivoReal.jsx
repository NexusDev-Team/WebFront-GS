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

// Seção "Dispositivo real", no fim do emulador (antes era a página /simulador-real): a imagem de
// como o C-Shield seria e o circuito dele rodando no Wokwi. Não lê o FIWARE; aqui nada envia
// ordem ao C-Shield.
import ImagemDispositivo from './ImagemDispositivo.jsx'
import WokwiEmbed from './WokwiEmbed.jsx'
import { URL_WOKWI } from '../../content/links.js'
import PainelVidro from '../ui/PainelVidro.jsx'
import TituloLed from '../ui/TituloLed.jsx'

export default function SecaoDispositivoReal() {
  return (
    <PainelVidro as="section" id="dispositivo-real" aria-labelledby="titulo-real" className="flex scroll-mt-24 flex-col gap-4 p-5 sm:p-8">
      <TituloLed nivel={2} variante="assumiu">
        <span id="titulo-real">Dispositivo real</span>
      </TituloLed>
      <p className="max-w-prose text-gelo-50">
        Tudo acima é um jogo. O C-Shield de verdade roda num ESP32; aqui você vê como ele seria e o
        circuito dele funcionando no simulador Wokwi.
      </p>
      <p className="max-w-prose text-gelo-300">
        Nem este site consegue dar ordens ao C-Shield. Ele só envia dados, e só quem está presente
        consegue liberar o bloqueio.
      </p>
      <div className="grid items-center gap-6 lg:grid-cols-2">
        <ImagemDispositivo />
        <WokwiEmbed url={URL_WOKWI} />
      </div>
    </PainelVidro>
  )
}
