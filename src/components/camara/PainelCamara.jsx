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

// A câmara por dentro (W20 a W26a): o visor LCD, o LED, os equipamentos desenhados, os relés, a
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
import Equipamento from './Equipamento.jsx'
import GraficoTemperatura from './GraficoTemperatura.jsx'
import Lcd16x2 from './Lcd16x2.jsx'
import LedEstado from './LedEstado.jsx'
import Rele from './Rele.jsx'

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

  return (
    <PainelVidro as="section" aria-labelledby="titulo-camara" className="flex flex-col gap-5 p-4 sm:p-6">
      <TituloLed nivel={2} variante={local.protegido ? 'assumiu' : 'repouso'}>
        <span id="titulo-camara">Câmara por dentro · {def.nome}</span>
      </TituloLed>

      {vista.temCShield ? (
        <div className="flex flex-col items-start gap-4">
          <Lcd16x2 linhas={vista.lcd} />
          <LedEstado cor={vista.corLed} />
          <BotaoSegurar segurar={segurar} />
        </div>
      ) : (
        <p className="rounded-lg border border-ataque bg-noite-900 p-3 text-gelo-50">
          Sem C-Shield aqui: ninguém vê, ninguém reage. Veja o que o ataque faz com a câmara.
        </p>
      )}

      <div className="flex flex-wrap gap-4" aria-label="Equipamentos da câmara" role="group">
        <Equipamento tipo="aquecedor" estado={eq.aquecedor} />
        <Equipamento tipo="ventoinha" estado={eq.ventoinhaEmergencia} />
        <Equipamento tipo="refrigeracao" estado={eq.refrigeracao} />
      </div>

      {vista.temCShield ? (
        <div className="flex flex-wrap gap-2">
          <Rele numero={1} comanda="aquecedor" agindo={eq.aquecedor === 'cortado'} acao="cortado" repouso="em repouso" />
          <Rele numero={2} comanda="ventoinha" agindo={eq.ventoinhaEmergencia} acao="ligada" repouso="em repouso" />
        </div>
      ) : null}

      <p className="text-gelo-50">
        <span className="font-mono text-sm text-gelo-300">Controlador: </span>
        {vista.controlador === 'ATAQUE' ? 'ordem de ataque' : 'ordem normal'} ({vista.setpointMandado} °C)
      </p>
      {vista.temCShield ? (
        <p className="text-gelo-300">
          Faixa segura: {vista.faixa.tMin} °C a {vista.faixa.tMax} °C · gravada no dispositivo
        </p>
      ) : null}

      <GraficoTemperatura pontos={local.historico} tMin={vista.faixa.tMin} tMax={vista.faixa.tMax} />
    </PainelVidro>
  )
}
