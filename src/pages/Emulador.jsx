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

// Página Emulador: "Seja o hacker". Um card só conta a história: em cima o atacante, com os botões
// das ações dele logo abaixo; no meio o mapa da cidade com 5 locais; embaixo a defesa, com o que
// dá para fazer no local escolhido (ativar ou desativar o C-Shield). Ao lado, o placar; depois, a
// câmara por dentro e a seção do dispositivo real. A página só liga as peças: o jogo inteiro vem
// de useCidadeSimulada (sem API).
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ID_PILOTO, LOCAIS } from '../domain/cidade.js'
import PainelCamara from '../components/camara/PainelCamara.jsx'
import AcoesAtacante from '../components/emulador/AcoesAtacante.jsx'
import AcoesDefesa from '../components/emulador/AcoesDefesa.jsx'
import AvisoAoVivo from '../components/emulador/AvisoAoVivo.jsx'
import MapaCidade from '../components/emulador/MapaCidade.jsx'
import PlacarComparativo from '../components/emulador/PlacarComparativo.jsx'
import SecaoDispositivoReal from '../components/emulador/SecaoDispositivoReal.jsx'
import BotaoLed from '../components/ui/BotaoLed.jsx'
import PainelVidro from '../components/ui/PainelVidro.jsx'
import PromptTerminal from '../components/ui/PromptTerminal.jsx'
import TituloLed from '../components/ui/TituloLed.jsx'
import { useCidadeSimulada } from '../hooks/useCidadeSimulada.js'
import { usePrefereMenosMovimento } from '../hooks/usePrefereMenosMovimento.js'

export default function Emulador() {
  const jogo = useCidadeSimulada()
  const reduzirMovimento = usePrefereMenosMovimento()
  const [selecionadoId, setSelecionadoId] = useState(ID_PILOTO)
  const { hash } = useLocation()

  // /emulador#dispositivo-real (e o antigo /simulador-real) rola até a seção do aparelho real.
  useEffect(() => {
    if (hash === '#dispositivo-real') {
      document.getElementById('dispositivo-real')?.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth' })
    }
  }, [hash, reduzirMovimento])

  const selecionado = LOCAIS.find((l) => l.id === selecionadoId) ?? null

  const haAtaque = Object.values(jogo.cidade.locais).some((l) => l.ordem !== 'NORMAL')

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <PromptTerminal>cshield --emulador</PromptTerminal>
        <TituloLed nivel={1} variante="ataque" className="!text-3xl sm:!text-4xl">
          Seja o hacker
        </TituloLed>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-gelo-300">Escolha um local, ataque e depois ative o C-Shield nele.</p>
          <span className="rounded-full border border-borda bg-noite-900 px-3 py-1 font-mono text-sm text-gelo-50">
            tempo acelerado: 1 s = 1 min
          </span>
          <BotaoLed as="a" href="#dispositivo-real" variante="fantasma">
            Ver o dispositivo real <span aria-hidden="true">↓</span>
          </BotaoLed>
        </div>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <PainelVidro as="section" aria-label="Simulação da cidade" className="flex flex-col">
          <div className="rounded-t-xl border-b border-ataque/40 bg-[color-mix(in_srgb,var(--color-ataque)_9%,transparent)] px-3 py-3">
            <AcoesAtacante
              selecionado={selecionado}
              haAtaque={haAtaque}
              aoAtacar={(tipo) => jogo.atacar(selecionadoId, tipo)}
              aoAtaqueEmMassa={() => jogo.ataqueEmMassa('CALOR')}
              aoPararAtaque={jogo.pararAtaques}
              aoRecomecar={jogo.recomecar}
            />
          </div>
          <div className="px-1 py-1 sm:px-2">
            <MapaCidade
              cidade={jogo.cidade}
              selecionadoId={selecionadoId}
              aoSelecionar={setSelecionadoId}
              reduzirMovimento={reduzirMovimento}
            />
          </div>
          <div className="rounded-b-xl border-t border-led-forte/40 bg-[color-mix(in_srgb,var(--color-led-forte)_9%,transparent)] px-3 py-3">
            <AcoesDefesa
              key={selecionadoId}
              def={selecionado}
              local={jogo.cidade.locais[selecionadoId]}
              piloto={selecionadoId === ID_PILOTO}
              aoAtivar={() => jogo.instalar(selecionadoId)}
              aoDesativar={() => jogo.remover(selecionadoId)}
            />
          </div>
        </PainelVidro>
        <PlacarComparativo placar={jogo.placar} />
      </div>
      <AvisoAoVivo cidade={jogo.cidade} />

      <PainelCamara key={selecionadoId} cidade={jogo.cidade} localId={selecionadoId} aoLiberar={jogo.liberar} />

      <SecaoDispositivoReal />
    </div>
  )
}
