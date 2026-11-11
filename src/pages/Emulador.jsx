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

// Página Emulador: "Seja o hacker". O mapa da cidade com 5 locais, os controles de ataque, o
// painel de instalações (o CRUD que decide quem tem o C-Shield) e, no fim, a seção do dispositivo
// real. A página só liga as peças: o jogo vem de useCidadeSimulada e as instalações de
// useInstalacoes.
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ID_PILOTO, LOCAIS } from '../domain/cidade.js'
import { idsInstalados } from '../domain/instalacoes.js'
import AvisoAoVivo from '../components/emulador/AvisoAoVivo.jsx'
import ControlesAtaque from '../components/emulador/ControlesAtaque.jsx'
import MapaCidade from '../components/emulador/MapaCidade.jsx'
import PainelInstalacoes from '../components/emulador/PainelInstalacoes.jsx'
import SecaoDispositivoReal from '../components/emulador/SecaoDispositivoReal.jsx'
import BotaoLed from '../components/ui/BotaoLed.jsx'
import PainelVidro from '../components/ui/PainelVidro.jsx'
import PromptTerminal from '../components/ui/PromptTerminal.jsx'
import TituloLed from '../components/ui/TituloLed.jsx'
import { useCidadeSimulada } from '../hooks/useCidadeSimulada.js'
import { useInstalacoes } from '../hooks/useInstalacoes.js'
import { usePrefereMenosMovimento } from '../hooks/usePrefereMenosMovimento.js'

export default function Emulador() {
  const jogo = useCidadeSimulada()
  const instalacoes = useInstalacoes()
  const reduzirMovimento = usePrefereMenosMovimento()
  const [selecionadoId, setSelecionadoId] = useState(ID_PILOTO)
  const { hash } = useLocation()
  const { sincronizar } = jogo
  const { itens, carregando, erro } = instalacoes

  // O mapa espelha as instalações cadastradas: quando a lista chega ou muda, o jogo sincroniza.
  useEffect(() => {
    if (!carregando && !erro) sincronizar(idsInstalados(itens))
  }, [itens, carregando, erro, sincronizar])

  // /emulador#dispositivo-real (e o antigo /simulador-real) rola até a seção do aparelho real.
  useEffect(() => {
    if (hash === '#dispositivo-real') {
      document.getElementById('dispositivo-real')?.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth' })
    }
  }, [hash, reduzirMovimento])

  const selecionado = LOCAIS.find((l) => l.id === selecionadoId) ?? null

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <PromptTerminal>cshield --emulador</PromptTerminal>
        <TituloLed nivel={1} variante="ataque">
          Seja o hacker
        </TituloLed>
        <p className="max-w-2xl text-lg text-gelo-300">
          Escolha um local no mapa e mande uma ordem perigosa para a câmara fria dele. Depois instale
          o C-Shield e veja a diferença.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-borda bg-noite-900 px-3 py-1 font-mono text-sm text-gelo-50">
            tempo acelerado: 1 s = 1 min
          </span>
          <BotaoLed as="a" href="#dispositivo-real" variante="fantasma">
            Ver o dispositivo real <span aria-hidden="true">↓</span>
          </BotaoLed>
        </div>
      </header>

      <PainelVidro as="section" aria-label="Mapa da cidade" className="p-2 sm:p-4">
        <MapaCidade
          cidade={jogo.cidade}
          selecionadoId={selecionadoId}
          aoSelecionar={setSelecionadoId}
          reduzirMovimento={reduzirMovimento}
        />
      </PainelVidro>
      <AvisoAoVivo cidade={jogo.cidade} />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <ControlesAtaque
          selecionado={selecionado}
          aoAtacar={(tipo) => jogo.atacar(selecionadoId, tipo)}
          aoAtaqueEmMassa={() => jogo.ataqueEmMassa('CALOR')}
          aoRecomecar={jogo.recomecar}
        />
        <PainelInstalacoes cidade={jogo.cidade} instalacoes={instalacoes} />
      </div>

      <SecaoDispositivoReal />
    </div>
  )
}
