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

// Cartão da leitura atual, como o widget do mockup: o número grande em fonte de instrumento e a
// pílula de estado. "Estabilizado" (verde-menta, com ícone) só aparece com a leitura dentro da
// faixa segura; fora dela a pílula diz isso em texto, no tom de atenção. O valor muda a cada
// poucos segundos, então não é anunciado por leitor de tela (aria-live desligado).
function IconeCheck() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="m6.5 10.2 2.3 2.3 4.7-4.9" />
    </svg>
  )
}

export default function WidgetLeitura({ titulo, temperatura, dentroDaFaixa, faixa }) {
  return (
    <PainelVidro as="article" className="flex flex-col justify-between gap-8 p-6 sm:p-8">
      <h3 className="text-lg font-bold text-gelo-50">{titulo}</h3>

      <div className="flex flex-col items-start gap-6">
        <p className="font-titulo leading-none font-bold tracking-tight text-gelo-50 tabular-nums" aria-live="off">
          <span className="text-6xl sm:text-7xl">{formatarGraus(temperatura)}</span>
          <span className="ml-2 text-3xl text-gelo-300">°C</span>
        </p>
        {dentroDaFaixa ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-menta px-5 py-2 text-base font-semibold text-menta-texto">
            <IconeCheck />
            Estado: estabilizado
          </p>
        ) : (
          <p className="inline-flex items-center gap-2 rounded-full border border-atencao px-5 py-2 text-base font-semibold text-gelo-50">
            Fora da faixa segura
          </p>
        )}
      </div>

      <p className="text-sm text-gelo-300">
        Faixa segura: {formatarGraus(faixa.tMin)} °C a {formatarGraus(faixa.tMax)} °C · gravada no dispositivo
      </p>
    </PainelVidro>
  )
}
