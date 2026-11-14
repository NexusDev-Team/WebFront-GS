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

import { Link } from 'react-router-dom'
import BotaoLed from '../ui/BotaoLed.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'
import PreviaAtaque from './PreviaAtaque.jsx'

// Seção "Simulação de ataque": o contraste que resume o projeto (3h30 contra segundos), uma prévia
// ilustrada do jogo e o botão para o emulador (a área interativa de verdade).
export default function ChamadaFinal({ conteudo }) {
  return (
    <Secao id="titulo-chamada" ancora="simulacao" rotulo={conteudo.rotulo} titulo={conteudo.titulo}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Revelar className="flex flex-col items-start gap-8">
          <div className="flex max-w-xl flex-col gap-3 text-lg leading-relaxed sm:text-xl">
            <p className="text-gelo-100">{conteudo.texto}</p>
            <p className="text-gelo-300">{conteudo.convite}</p>
          </div>
          <BotaoLed as={Link} to={conteudo.acao.para} seta className="min-h-14! px-8!">
            {conteudo.acao.rotulo}
          </BotaoLed>
        </Revelar>

        <Revelar atraso={0.15}>
          <PainelVidro className="p-4 sm:p-6">
            <PreviaAtaque className="h-auto w-full" />
          </PainelVidro>
        </Revelar>
      </div>
    </Secao>
  )
}
