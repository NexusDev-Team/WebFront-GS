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

import { Link } from 'react-router-dom'
import { PERFIS_FIRMWARE } from '../../domain/perfis.js'
import { amplitudeDaSerie } from '../../domain/serieDemo.js'
import { DEMO } from '../../content/inicio.js'
import GraficoArea from '../graficos/GraficoArea.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import TituloSecao from '../ui/TituloSecao.jsx'
import { formatarGraus } from '../ui/formato.js'
import DisplayCShield from './DisplayCShield.jsx'
import IndicadorRele from './IndicadorRele.jsx'

function IconeAlerta() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0 text-critico" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 10v4M12 17.2v.01" />
    </svg>
  )
}

// Seção "Painel do C-Shield", em blocos como no mockup: o display, os alertas, a variação térmica
// e o histórico com os relés. Tudo é leitura da demonstração simulada; o vermelho só aparece no
// ícone e na borda do cartão de alertas. `serie` vem da página (a mesma das outras seções).
export default function SecaoPainel({ conteudo, serie }) {
  const perfil = PERFIS_FIRMWARE[DEMO.perfil]
  const temperaturas = serie.map((leitura) => leitura.temperatura)

  return (
    <section aria-labelledby="titulo-painel" className="border-t border-borda py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <TituloSecao id="titulo-painel" subtitulo={conteudo.subtitulo}>
          {conteudo.titulo}
        </TituloSecao>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr_1.1fr]">
          <DisplayCShield conteudo={conteudo.display} temperaturaAlvo={perfil.tAlvo} />

          <div className="flex flex-col gap-4">
            <article className="flex flex-col gap-2 rounded-2xl border border-critico/40 bg-alerta-fundo p-6">
              <h3 className="flex items-center justify-between gap-3 text-lg font-bold text-gelo-50">
                {conteudo.alertas.titulo}
                <IconeAlerta />
              </h3>
              <p className="text-gelo-50">{conteudo.alertas.texto}</p>
              <p className="text-sm text-gelo-300">{conteudo.alertas.aviso}</p>
            </article>

            <PainelVidro as="article" className="flex flex-col gap-3 p-6">
              <h3 className="text-lg font-bold text-gelo-50">{conteudo.variacao.titulo}</h3>
              <p className="font-titulo text-5xl leading-none font-bold tracking-tight text-gelo-50 tabular-nums">
                ±{formatarGraus(amplitudeDaSerie(serie))} <span className="text-2xl text-gelo-300">°C</span>
              </p>
            </PainelVidro>

            <Link
              to={conteudo.faixa.para}
              className="cartao flex min-h-14 items-center justify-between gap-3 px-6 py-3 font-semibold text-gelo-50 transition-colors hover:text-led-forte"
            >
              {conteudo.faixa.rotulo}
              <span aria-hidden="true">›</span>
            </Link>
          </div>

          <PainelVidro as="article" className="flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-gelo-50">{conteudo.historico.titulo}</h3>
            </div>
            <GraficoArea
              temperaturas={temperaturas.slice(-12)}
              titulo={`${conteudo.historico.titulo} da ${DEMO.titulo.toLowerCase()}`}
              altura={170}
            />
            <ul className="flex flex-col gap-4 border-t border-borda pt-5">
              {conteudo.historico.reles.map((rele) => (
                <IndicadorRele key={rele.nome} {...rele} />
              ))}
            </ul>
            <p className="text-sm text-gelo-300">{conteudo.historico.nota}</p>
          </PainelVidro>
        </div>
      </div>
    </section>
  )
}
