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
import CabecalhoPagina from '../components/ui/CabecalhoPagina.jsx'

export default function NaoEncontrada() {
  return (
    <CabecalhoPagina
      rotulo="Erro 404"
      titulo="Esta câmara"
      destaque="não existe."
      subtitulo="A página que você procurou não foi encontrada. Volte ao início para seguir de lá."
      className="flex min-h-[70vh] flex-col justify-center"
    >
      <BotaoLed as={Link} to="/">
        Voltar ao início
      </BotaoLed>
    </CabecalhoPagina>
  )
}
