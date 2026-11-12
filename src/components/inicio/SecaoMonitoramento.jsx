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

import { dentroDaFaixa } from '../../domain/serieDemo.js'
import { PERFIS_FIRMWARE } from '../../domain/perfis.js'
import { DEMO } from '../../content/inicio.js'
import TituloSecao from '../ui/TituloSecao.jsx'
import CartaoGrafico from './CartaoGrafico.jsx'
import WidgetLeitura from './WidgetLeitura.jsx'

// Seção "Monitoramento de temperatura": a leitura atual e o gráfico, como no mockup. Os dados são
// uma demonstração simulada no navegador, e o subtítulo diz isso. `temperaturas` vem da página
// (o mesmo conjunto alimenta o painel mais abaixo).
export default function SecaoMonitoramento({ temperaturas }) {
  const perfil = PERFIS_FIRMWARE[DEMO.perfil]
  const atual = temperaturas[temperaturas.length - 1]

  return (
    <section aria-labelledby="titulo-monitoramento" className="border-t border-borda py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <TituloSecao
          id="titulo-monitoramento"
          subtitulo="Demonstração com dados simulados no navegador. O aparelho de verdade envia as leituras reais para a central."
        >
          Monitoramento de temperatura
        </TituloSecao>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <WidgetLeitura
            titulo={DEMO.titulo}
            temperatura={atual}
            dentroDaFaixa={dentroDaFaixa(atual, perfil)}
            faixa={perfil}
          />
          <CartaoGrafico temperaturas={temperaturas} nome={DEMO.titulo} limiteMax={perfil.tMax} />
        </div>
      </div>
    </section>
  )
}
