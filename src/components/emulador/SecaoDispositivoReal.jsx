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
// como o C-Shield seria e o circuito dele rodando no Wokwi. Em faixa, como as outras seções.
// Não lê o FIWARE; aqui nada envia ordem ao C-Shield.
import ImagemDispositivo from './ImagemDispositivo.jsx'
import WokwiEmbed from './WokwiEmbed.jsx'
import { URL_WOKWI } from '../../content/links.js'
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'

export default function SecaoDispositivoReal() {
  return (
    <Secao
      id="titulo-real"
      ancora="dispositivo-real"
      rotulo="De verdade"
      titulo="Dispositivo real"
      subtitulo="Tudo acima é um jogo. O C-Shield de verdade roda num ESP32; aqui você vê como ele seria e o circuito dele funcionando no simulador Wokwi. Nem este site consegue dar ordens ao C-Shield: ele só envia dados, e só quem está presente consegue liberar o bloqueio."
      faixa
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <Revelar>
          <ImagemDispositivo />
        </Revelar>
        <Revelar atraso={0.1}>
          <WokwiEmbed url={URL_WOKWI} />
        </Revelar>
      </div>
    </Secao>
  )
}
