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

import { lazy, Suspense } from 'react'
import { DEMO, PAINEL } from '../../content/inicio.js'
import { PERFIS_FIRMWARE } from '../../domain/perfis.js'
import { dentroDaFaixa } from '../../domain/serieDemo.js'
import PainelVidro from '../ui/PainelVidro.jsx'
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'
import { formatarGraus } from '../ui/formato.js'
import WidgetLeitura from './WidgetLeitura.jsx'

// O recharts pesa mais de 150 KB: o gráfico carrega sob demanda, para o hero não esperar por ele.
const GraficoMonitoramento = lazy(() => import('../graficos/GraficoMonitoramento.jsx'))

// Seção "Monitoramento": a leitura atual e o histórico térmico, só isso. Tudo é leitura de uma
// demonstração simulada no navegador (a série vem da página): nada aqui manda ordens ao C-Shield.
export default function SecaoMonitoramento({ serie }) {
  const perfil = PERFIS_FIRMWARE[DEMO.perfil]
  const temperaturas = serie.map((leitura) => leitura.temperatura)
  const atual = temperaturas[temperaturas.length - 1]

  return (
    <Secao
      id="titulo-monitoramento"
      ancora="monitoramento"
      rotulo="Monitoramento"
      titulo="Monitoramento de temperatura"
      subtitulo={PAINEL.subtitulo}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Revelar className="h-full">
          <WidgetLeitura
            titulo={DEMO.titulo}
            temperatura={atual}
            dentroDaFaixa={dentroDaFaixa(atual, perfil)}
            faixa={perfil}
          />
        </Revelar>

        <Revelar atraso={0.1} className="h-full">
          <PainelVidro as="article" className="flex h-full flex-col gap-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gelo-50">{PAINEL.historico.titulo}</h3>
              <p className="inline-flex items-center gap-2 rounded-full border border-borda px-3 py-1 font-mono text-xs tracking-wider text-gelo-300 uppercase">
                <span aria-hidden="true" className="size-2 rounded-full bg-ciano" />
                Simulado
              </p>
            </div>
            <Suspense fallback={<div aria-hidden="true" className="h-65" />}>
              <GraficoMonitoramento
                temperaturas={temperaturas}
                titulo={`Temperatura da ${DEMO.titulo.toLowerCase()}`}
                limite={{ valor: perfil.tMax, rotulo: `limite ${formatarGraus(perfil.tMax)} °C` }}
                altura={260}
              />
            </Suspense>
          </PainelVidro>
        </Revelar>
      </div>
    </Secao>
  )
}
