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
import { TriangleAlert } from 'lucide-react'
import { DEMO, PAINEL } from '../../content/inicio.js'
import { PERFIS_FIRMWARE } from '../../domain/perfis.js'
import { amplitudeDaSerie, dentroDaFaixa } from '../../domain/serieDemo.js'
import PainelVidro from '../ui/PainelVidro.jsx'
import Revelar from '../ui/Revelar.jsx'
import Secao from '../ui/Secao.jsx'
import { formatarGraus } from '../ui/formato.js'
import IndicadorRele from './IndicadorRele.jsx'
import WidgetLeitura from './WidgetLeitura.jsx'

// O recharts pesa mais de 150 KB: o gráfico carrega sob demanda, para o hero não esperar por ele.
const GraficoMonitoramento = lazy(() => import('../graficos/GraficoMonitoramento.jsx'))

// Seção "Monitoramento": a leitura atual, o histórico térmico e, numa fileira curta, os alertas, a
// variação do período e os relés. Tudo é leitura de uma demonstração simulada no navegador (a série
// vem da página): nada aqui manda ordens ao C-Shield, e o vermelho só aparece no cartão de alertas.
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

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Revelar className="h-full">
          <article className="flex h-full flex-col gap-2 rounded-2xl border border-critico/40 bg-alerta-fundo p-6">
            <h3 className="flex items-center justify-between gap-3 text-lg font-semibold text-gelo-50">
              {PAINEL.alertas.titulo}
              <TriangleAlert aria-hidden="true" className="size-5 shrink-0 text-critico" />
            </h3>
            <p className="text-gelo-50">{PAINEL.alertas.texto}</p>
            <p className="text-sm text-gelo-300">{PAINEL.alertas.aviso}</p>
          </article>
        </Revelar>

        <Revelar atraso={0.1} className="h-full">
          <PainelVidro as="article" className="flex h-full flex-col gap-3 p-6">
            <h3 className="text-lg font-semibold text-gelo-50">{PAINEL.variacao.titulo}</h3>
            <p className="font-titulo text-5xl leading-none font-semibold tracking-tight text-gelo-50 tabular-nums">
              ±{formatarGraus(amplitudeDaSerie(serie))} <span className="text-2xl text-gelo-300">°C</span>
            </p>
          </PainelVidro>
        </Revelar>

        <Revelar atraso={0.2} className="h-full">
          <PainelVidro as="article" className="flex h-full flex-col gap-4 p-6">
            <ul className="flex flex-col gap-4">
              {PAINEL.historico.reles.map((rele) => (
                <IndicadorRele key={rele.nome} {...rele} />
              ))}
            </ul>
            <p className="mt-auto text-sm text-gelo-300">{PAINEL.historico.nota}</p>
          </PainelVidro>
        </Revelar>
      </div>
    </Secao>
  )
}
