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

// Faixa final da página inicial: o contraste que resume o projeto (3h30 contra segundos) e o
// botão para o emulador.
export default function ChamadaFinal({ conteudo }) {
  return (
    <section aria-labelledby="titulo-chamada" className="border-t border-borda py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="cartao flex flex-col gap-8 px-6 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <h2 id="titulo-chamada" className="max-w-2xl text-2xl font-bold text-balance text-gelo-50 sm:text-3xl">
            {conteudo.texto}
          </h2>
          <BotaoLed as={Link} to={conteudo.acao.para} className="shrink-0 self-start sm:self-auto">
            {conteudo.acao.rotulo}
          </BotaoLed>
        </div>
      </div>
    </section>
  )
}
