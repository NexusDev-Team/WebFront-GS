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


// Página 404: rota inexistente.
import { Link } from 'react-router-dom'
import BotaoLed from '../components/ui/BotaoLed.jsx'
import Pagina from '../components/ui/Pagina.jsx'
import Rotulo from '../components/ui/Rotulo.jsx'
import TituloLed from '../components/ui/TituloLed.jsx'

export default function NaoEncontrada() {
  return (
    <Pagina as="section" className="flex min-h-[60vh] flex-col items-start justify-center gap-6">
      <Rotulo>Erro 404</Rotulo>
      <TituloLed nivel={1}>Esta câmara não existe.</TituloLed>
      <p className="max-w-prose text-lg text-gelo-300">
        A página que você procurou não foi encontrada. Volte ao início para seguir de lá.
      </p>
      <BotaoLed as={Link} to="/">
        Voltar ao início
      </BotaoLed>
    </Pagina>
  )
}
