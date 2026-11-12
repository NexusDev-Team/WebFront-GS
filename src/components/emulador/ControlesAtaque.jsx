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

// Os controles do jogo (W12, W15, W18): atacar o local escolhido (calor ou frio), o ataque em
// massa, parar o ataque (só desfaz as ordens) e recomeçar (zera o jogo). Os botões de ataque ficam em leet, com aria-label legível. Proteger um local
// NÃO está aqui: isso é o painel do local escolhido (o C-Shield só entra onde foi ativado).
import BotaoLed from '../ui/BotaoLed.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'

export default function ControlesAtaque({ selecionado, haAtaque, aoAtacar, aoAtaqueEmMassa, aoPararAtaque, aoRecomecar }) {
  return (
    <PainelVidro as="section" aria-label="Controles do ataque" className="flex flex-col gap-4 p-4 sm:p-6">
      <p className="text-gelo-50" aria-live="polite">
        {selecionado ? (
          <>
            Alvo escolhido: <strong>{selecionado.nome}</strong>
          </>
        ) : (
          'Toque num local do mapa para escolher o alvo.'
        )}
      </p>
      <div className="flex flex-wrap gap-3">
        <BotaoLed variante="ataque" ariaLabel="Ataque de calor" disabled={!selecionado} onClick={() => aoAtacar('CALOR')}>
          4T4QU3 D3 C4L0R
        </BotaoLed>
        <BotaoLed variante="ataque" ariaLabel="Ataque de frio" disabled={!selecionado} onClick={() => aoAtacar('FRIO')}>
          4T4QU3 D3 FR10
        </BotaoLed>
      </div>
      <div className="flex flex-wrap gap-3 border-t border-borda pt-4">
        <BotaoLed variante="ataque" ariaLabel="Ataque em massa: esquentar os cinco locais de uma vez" onClick={aoAtaqueEmMassa}>
          Ataque em massa
        </BotaoLed>
        <BotaoLed variante="fantasma" ariaLabel="Parar ataque: desfaz as ordens sem recomeçar o jogo" disabled={!haAtaque} onClick={aoPararAtaque}>
          Parar ataque
        </BotaoLed>
        <BotaoLed variante="fantasma" ariaLabel="Recomeçar o jogo do zero" onClick={aoRecomecar}>
          Recomeçar
        </BotaoLed>
      </div>
      <p className="text-sm text-gelo-300">
        Quer ver o C-Shield barrar o ataque? Clique num local e ative o C-Shield nele.
      </p>
    </PainelVidro>
  )
}
