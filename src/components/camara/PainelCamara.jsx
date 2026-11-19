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

// A câmara por dentro, numa coluna só ao lado do mapa: o visor LCD, o LED, os equipamentos desenhados, a
// ordem que o controlador recebeu, o gráfico de temperatura com a faixa segura e o botão de
// segurar 3 s que libera de verdade. Sem C-Shield no local, só se vê o que o ataque faz. A faixa
// segura é só leitura: "gravada no dispositivo". Use key={localId} para zerar os avisos ao trocar
// de local.
import { useState } from 'react'
import { LIBERACAO_MS } from '../../domain/config.js'
import { LOCAIS } from '../../domain/cidade.js'
import { useCShield } from '../../hooks/useCShield.js'
import { useSegurar } from '../../hooks/useSegurar.js'
import BotaoSegurar from '../ui/BotaoSegurar.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import TituloLed from '../ui/TituloLed.jsx'
import { formatarGraus } from '../ui/formato.js'
import Equipamento from './Equipamento.jsx'
import GraficoTemperatura from './GraficoTemperatura.jsx'
import Lcd16x2 from './Lcd16x2.jsx'
import LedEstado from './LedEstado.jsx'

// Uma leitura simples (rótulo pequeno e valor grande), para o painel de um local sem C-Shield.
function Leitura({ rotulo, valor, alerta = false }) {
  return (
    <div className={`flex flex-col gap-1 rounded-lg border bg-noite-900 p-3 ${alerta ? 'border-ataque' : 'border-borda'}`}>
      <span className="text-xs text-gelo-300">{rotulo}</span>
      <span className="font-titulo text-xl leading-tight font-semibold text-gelo-50 tabular-nums">{valor}</span>
    </div>
  )
}

const AVISO_MS = 3000
// O que aconteceu com o pedido de liberação → o aviso que o visor mostra por 3 s.
const TIPO_AVISO = { RECUSADA: 'TRAVA', ACEITA: 'LIBERADO', SEM_BLOQUEIO: 'SEM_BLOQUEIO' }

export default function PainelCamara({ cidade, localId, aoLiberar }) {
  const def = LOCAIS.find((l) => l.id === localId)
  const local = cidade.locais[localId]
  const [aviso, setAviso] = useState(null)

  const segurar = useSegurar(LIBERACAO_MS, () => {
    const resultado = aoLiberar(localId)
    setAviso({ tipo: TIPO_AVISO[resultado], ateRealMs: Date.now() + AVISO_MS })
  })
  const vista = useCShield(cidade, localId, { progressoLiberacao: segurar.progresso, aviso })
  const eq = vista.equipamentos
  const foraDaFaixa = local.temperatura > vista.faixa.tMax || local.temperatura < vista.faixa.tMin

  return (
    <PainelVidro as="section" aria-labelledby="titulo-camara" className="flex h-full flex-col gap-4 p-4 sm:p-5">
      <div className="flex flex-col gap-1">
        <TituloLed nivel={2} variante={local.protegido ? 'assumiu' : 'repouso'} className="text-2xl!">
          <span id="titulo-camara">Câmara por dentro</span>
        </TituloLed>
        <p className="text-gelo-300">{def.nome}</p>
      </div>

      {vista.temCShield ? (
        <>
          <Lcd16x2 linhas={vista.lcd} />
          <div className="flex items-center justify-between gap-3">
            <LedEstado cor={vista.corLed} className="min-w-0 flex-1 text-sm" />
            <BotaoSegurar segurar={segurar} />
          </div>
        </>
      ) : (
        <>
          <p className="rounded-lg border border-ataque bg-noite-900 p-3 text-gelo-50">
            Sem C-Shield aqui: ninguém vê, ninguém reage. Veja o que o ataque faz com a câmara.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Leitura rotulo="Temperatura agora" valor={`${formatarGraus(local.temperatura)} °C`} alerta={foraDaFaixa} />
            <Leitura rotulo="O produto aguenta" valor={`${vista.faixa.tMin} a ${vista.faixa.tMax} °C`} />
          </div>
          <p className={foraDaFaixa ? 'text-gelo-50' : 'text-gelo-300'}>
            {foraDaFaixa
              ? 'Fora da faixa: pode estragar.'
              : 'Dentro da faixa, por enquanto.'}
          </p>
        </>
      )}

      <div className="flex flex-col gap-1 text-sm">
        <p className="text-gelo-50">
          <span className="font-mono text-xs text-gelo-300">Controlador: </span>
          {vista.controlador === 'ATAQUE' ? 'ordem de ataque' : 'ordem normal'} ({vista.setpointMandado} °C)
        </p>
        {vista.temCShield ? (
          <p className="text-gelo-300">
            Faixa segura: {vista.faixa.tMin} °C a {vista.faixa.tMax} °C · gravada no dispositivo
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-2" aria-label="Equipamentos da câmara" role="group">
        <Equipamento tipo="aquecedor" estado={eq.aquecedor} />
        <Equipamento tipo="ventoinha" estado={eq.ventoinhaEmergencia} />
        <Equipamento tipo="refrigeracao" estado={eq.refrigeracao} />
      </div>

      <div className="mt-auto">
        <GraficoTemperatura pontos={local.historico} tMin={vista.faixa.tMin} tMax={vista.faixa.tMax} />
      </div>
    </PainelVidro>
  )
}
