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

// Página Emulador: "Seja o hacker". Em blocos: cabeçalho, o mapa da cidade com os controles do
// ataque ao lado, o placar das duas UBS e, nas abas, a câmara por dentro, as instalações do
// C-Shield (o CRUD) e o dispositivo real. A página só liga as peças: o jogo vem de
// useCidadeSimulada e as instalações de useInstalacoes.
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ID_PILOTO, LOCAIS } from '../domain/cidade.js'
import { algumSobAtaque } from '../domain/cidade-placar.js'
import { idsInstalados } from '../domain/instalacoes.js'
import PainelCamara from '../components/camara/PainelCamara.jsx'
import AbasEmulador from '../components/emulador/AbasEmulador.jsx'
import AvisoAoVivo from '../components/emulador/AvisoAoVivo.jsx'
import ControlesAtaque from '../components/emulador/ControlesAtaque.jsx'
import MapaCidade from '../components/emulador/MapaCidade.jsx'
import PainelInstalacoes from '../components/emulador/PainelInstalacoes.jsx'
import PlacarComparativo from '../components/emulador/PlacarComparativo.jsx'
import SecaoDispositivoReal from '../components/emulador/SecaoDispositivoReal.jsx'
import PainelVidro from '../components/ui/PainelVidro.jsx'
import Pagina from '../components/ui/Pagina.jsx'
import Rotulo from '../components/ui/Rotulo.jsx'
import TituloLed from '../components/ui/TituloLed.jsx'
import { useCidadeSimulada } from '../hooks/useCidadeSimulada.js'
import { useInstalacoes } from '../hooks/useInstalacoes.js'
import { usePrefereMenosMovimento } from '../hooks/usePrefereMenosMovimento.js'

const ABA_PADRAO = 'camara'
const ABA_DISPOSITIVO_REAL = 'real'

export default function Emulador() {
  const jogo = useCidadeSimulada()
  const instalacoes = useInstalacoes()
  const reduzirMovimento = usePrefereMenosMovimento()
  const [selecionadoId, setSelecionadoId] = useState(ID_PILOTO)
  const { hash } = useLocation()
  const { sincronizar } = jogo
  const { itens, carregando, erro } = instalacoes

  // /emulador#dispositivo-real (e o antigo /simulador-real) abre a aba do dispositivo real. A aba
  // é ajustada durante a renderização quando o hash muda, sem efeito colateral.
  const abaDoHash = hash === '#dispositivo-real' ? ABA_DISPOSITIVO_REAL : null
  const [hashVisto, setHashVisto] = useState(hash)
  const [aba, setAba] = useState(abaDoHash ?? ABA_PADRAO)
  if (hash !== hashVisto) {
    setHashVisto(hash)
    if (abaDoHash) setAba(abaDoHash)
  }

  // O mapa espelha as instalações cadastradas: quando a lista chega ou muda, o jogo sincroniza.
  useEffect(() => {
    if (!carregando && !erro) sincronizar(idsInstalados(itens))
  }, [itens, carregando, erro, sincronizar])

  // Com a aba já aberta, rola até a seção do aparelho real.
  useEffect(() => {
    if (hash === '#dispositivo-real') {
      document.getElementById('dispositivo-real')?.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth' })
    }
  }, [hash, reduzirMovimento])

  const selecionado = LOCAIS.find((l) => l.id === selecionadoId) ?? null

  const abas = [
    {
      id: ABA_PADRAO,
      rotulo: 'Câmara',
      conteudo: <PainelCamara key={selecionadoId} cidade={jogo.cidade} localId={selecionadoId} aoLiberar={jogo.liberar} />,
    },
    {
      id: 'instalacoes',
      rotulo: 'Instalações',
      conteudo: <PainelInstalacoes cidade={jogo.cidade} instalacoes={instalacoes} />,
    },
    { id: ABA_DISPOSITIVO_REAL, rotulo: 'Dispositivo real', conteudo: <SecaoDispositivoReal /> },
  ]

  return (
    <Pagina className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <Rotulo>Simulador</Rotulo>
        <TituloLed nivel={1} variante={algumSobAtaque(jogo.cidade) ? 'ataque' : 'repouso'}>
          Seja o hacker
        </TituloLed>
        <p className="max-w-2xl text-lg text-gelo-300">
          Escolha um local no mapa e mande uma ordem perigosa para a câmara fria dele. Depois instale
          o C-Shield e veja a diferença.
        </p>
        <p className="w-fit rounded-full border border-borda bg-noite-900 px-3 py-1 text-sm text-gelo-300">
          Tempo acelerado: 1 s = 1 min
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-2">
          <PainelVidro as="section" aria-label="Mapa da cidade" className="p-2 sm:p-4">
            <MapaCidade
              cidade={jogo.cidade}
              selecionadoId={selecionadoId}
              aoSelecionar={setSelecionadoId}
              reduzirMovimento={reduzirMovimento}
            />
          </PainelVidro>
          <AvisoAoVivo cidade={jogo.cidade} />
        </div>
        <ControlesAtaque
          selecionado={selecionado}
          aoAtacar={(tipo) => jogo.atacar(selecionadoId, tipo)}
          aoAtaqueEmMassa={() => jogo.ataqueEmMassa('CALOR')}
          aoRecomecar={jogo.recomecar}
        />
      </div>

      <PlacarComparativo placar={jogo.placar} />

      <AbasEmulador abas={abas} ativa={aba} aoMudar={setAba} />
    </Pagina>
  )
}
