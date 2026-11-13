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

// As ações de defesa, na parte de baixo do card da simulação: o que dá para fazer no local
// escolhido para protegê-lo. ATIVAR ou DESATIVAR o C-Shield nele, na hora, só dentro do jogo. A
// desativação fica desligada, com o motivo escrito, enquanto o ataque estiver bloqueado: o
// bloqueio só termina presencialmente (botão de segurar na câmara por dentro). A unidade piloto
// é fixa. A altura mínima é a mesma em todos os estados, para o card não mudar de tamanho ao
// trocar de local ou ao ativar o C-Shield.
import { motivoNaoDesativar } from '../../domain/cidade-protecao.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import Logo from '../ui/Logo.jsx'

export default function AcoesDefesa({ def, local, piloto, aoAtivar, aoDesativar }) {
  const motivo = motivoNaoDesativar(local)
  return (
    <div className="flex min-h-24 flex-col items-center justify-center gap-2 text-center" role="group" aria-label="Defesa do local escolhido">
      <p className="flex flex-wrap items-center justify-center gap-2 text-gelo-50" aria-live="polite">
        <Logo variante="escudo" />
        <span className="font-titulo text-lg font-semibold">Defesa</span>
        <span className="text-gelo-300">
          · <strong className="text-gelo-50">{def.nome}</strong>: {local.protegido ? 'com C-Shield' : 'sem C-Shield'}
        </span>
      </p>

      {piloto ? (
        <p className="text-gelo-300">Unidade piloto: o C-Shield já vem instalado aqui e não pode ser desativado.</p>
      ) : null}

      {!piloto && !local.protegido ? <BotaoLed onClick={aoAtivar}>Ativar C-Shield nesse local</BotaoLed> : null}

      {!piloto && local.protegido ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <BotaoLed variante="ataque" onClick={aoDesativar} disabled={Boolean(motivo)}>
            Desativar C-Shield nesse local
          </BotaoLed>
          {motivo ? <span className="text-sm text-gelo-300">{motivo}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
