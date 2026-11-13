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

import PainelVidro from '../ui/PainelVidro.jsx'
import { formatarGraus } from '../ui/formato.js'

// Card de vidro da leitura atual (Design System v1.0, §7): "Temperatura atual", a pílula "Online"
// com o LED verde, o número grande em fonte de instrumento e o estado. "Estabilizado" só aparece
// com a leitura dentro da faixa segura; fora dela a pílula diz isso em texto, no tom de atenção.
// O valor muda a cada poucos segundos, então não é anunciado por leitor de tela (aria-live
// desligado). Os dados são simulados no navegador e o rodapé diz isso.
export default function WidgetLeitura({ titulo, temperatura, dentroDaFaixa, faixa }) {
  return (
    <PainelVidro as="article" className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="rotulo-tecnico">Temperatura atual</p>
          <h3 className="mt-2 text-lg font-semibold text-gelo-50">{titulo}</h3>
        </div>
        <p className="inline-flex items-center gap-2 rounded-full border border-ok/40 bg-ok/10 px-3 py-1 font-mono text-xs tracking-wider text-ok uppercase">
          <span aria-hidden="true" className="faisca-pulsa size-2 rounded-full bg-ok" />
          Online
        </p>
      </div>

      <div className="flex flex-col items-start gap-5">
        <p className="font-titulo leading-none font-semibold tracking-tight text-gelo-50 tabular-nums" aria-live="off">
          <span className="text-6xl sm:text-7xl">{formatarGraus(temperatura)}</span>
          <span className="ml-2 text-3xl text-gelo-300">°C</span>
        </p>
        {dentroDaFaixa ? (
          <p className="inline-flex items-center rounded-full bg-menta px-5 py-2 text-base font-semibold text-menta-texto">
            Estado: estabilizado
          </p>
        ) : (
          <p className="inline-flex items-center rounded-full border border-atencao px-5 py-2 text-base font-semibold text-gelo-50">
            Fora da faixa segura
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1 text-sm text-gelo-300">
        <p>
          Faixa segura: {formatarGraus(faixa.tMin)} °C a {formatarGraus(faixa.tMax)} °C · gravada no dispositivo
        </p>
        <p>Demonstração com dados simulados.</p>
      </div>
    </PainelVidro>
  )
}
