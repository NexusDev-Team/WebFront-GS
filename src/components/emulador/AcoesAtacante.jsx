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

// As ações do atacante, no alto do card da simulação, logo abaixo do ícone dele:
// atacar o local escolhido (um botão só: esquenta a câmara), o ataque em massa, parar o ataque (só desfaz as
// ordens) e recomeçar (zera o jogo). O botão de ataque fica em leet, com aria-label legível.
// Proteger um local NÃO está aqui: isso é a zona de defesa, na parte de baixo do card.
import BotaoLed from '../ui/BotaoLed.jsx'
import Atacante from './Atacante.jsx'

export default function AcoesAtacante({ selecionado, haAtaque, aoAtacar, aoAtaqueEmMassa, aoPararAtaque, aoRecomecar }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center" role="group" aria-label="Ações do atacante">
      <p className="flex items-center gap-2 text-gelo-50">
        <Atacante />
        <span className="font-titulo text-lg font-semibold">Atacante</span>
        <span className="text-gelo-300" aria-live="polite">
          · alvo: {selecionado ? <strong className="text-gelo-50">{selecionado.nome}</strong> : 'escolha um local no mapa'}
        </span>
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <BotaoLed className="px-3! text-sm!" variante="ataque" ariaLabel="Ataque" disabled={!selecionado} onClick={() => aoAtacar('CALOR')}>
          4T4QU3
        </BotaoLed>
        <BotaoLed className="px-3! text-sm!" variante="ataque" ariaLabel="Ataque em massa: esquentar os cinco locais de uma vez" onClick={aoAtaqueEmMassa}>
          Ataque em massa
        </BotaoLed>
        <BotaoLed className="px-3! text-sm!" variante="fantasma" ariaLabel="Parar ataque: desfaz as ordens sem recomeçar o jogo" disabled={!haAtaque} onClick={aoPararAtaque}>
          Parar ataque
        </BotaoLed>
        <BotaoLed className="px-3! text-sm!" variante="fantasma" ariaLabel="Recomeçar o jogo do zero" onClick={aoRecomecar}>
          Recomeçar
        </BotaoLed>
      </div>
    </div>
  )
}
