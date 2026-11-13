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

// Página Nexus Dev: quem fez o C-Shield. Cabeçalho, os cinco integrantes (a mesma lista da página
// inicial, agora com a função de cada um) ao lado das tecnologias, a visão, a cultura e um resumo da
// GS 2026.2. Textos em src/content (rascunho para a equipe revisar).
import ListaEquipe from '../components/equipe/ListaEquipe.jsx'
import ListaTecnologias from '../components/equipe/ListaTecnologias.jsx'
import CabecalhoPagina from '../components/ui/CabecalhoPagina.jsx'
import FundoCyber from '../components/ui/FundoCyber.jsx'
import LinkSeta from '../components/ui/LinkSeta.jsx'
import Revelar from '../components/ui/Revelar.jsx'
import Secao from '../components/ui/Secao.jsx'
import { NEXUS } from '../content/inicio.js'
import { CULTURA, SOBRE_GS, VISAO } from '../content/nexusDev.js'

export default function NexusDev() {
  return (
    <>
      <CabecalhoPagina
        rotulo="A equipe"
        titulo="Nexus Dev"
        destaque="Quem constrói o C-Shield"
        subtitulo="Somos cinco estudantes de Engenharia de Software da FIAP, no primeiro ano, e fizemos o C-Shield para a Global Solution 2026.2."
      />

      <Secao id="titulo-integrantes" rotulo="Integrantes" titulo="Quem faz o C-Shield">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Revelar className="flex flex-col items-start gap-8">
            <div>
              <p className="rotulo-tecnico mb-4">Tecnologias</p>
              <ListaTecnologias tecnologias={NEXUS.tecnologias} />
            </div>
          </Revelar>
          <Revelar atraso={0.1}>
            <p className="rotulo-tecnico mb-4">Integrantes</p>
            <ListaEquipe comFuncao />
          </Revelar>
        </div>
      </Secao>

      <Secao id="titulo-visao" rotulo="Visão" titulo="Nossa visão" faixa>
        <Revelar>
          <p className="max-w-4xl border-l-2 border-ciano pl-6 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-snug text-gelo-50">
            {VISAO}
          </p>
        </Revelar>
      </Secao>

      <Secao id="titulo-cultura" rotulo="Cultura" titulo="Nossa cultura" fundo={<FundoCyber />}>
        <Revelar>
          <ol className="divide-y divide-borda border-y border-borda">
            {CULTURA.map((c, indice) => (
              <li key={c.titulo} className="grid gap-2 py-6 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
                <span aria-hidden="true" className="font-mono text-sm tracking-widest text-gelo-azul">
                  {String(indice + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-semibold text-gelo-50">{c.titulo}</h3>
                <p className="text-gelo-300">{c.texto}</p>
              </li>
            ))}
          </ol>
        </Revelar>
      </Secao>

      <Secao id="titulo-sobre-gs" rotulo="Global Solution" titulo="Sobre a GS 2026.2" faixa>
        <Revelar className="flex max-w-3xl flex-col gap-5">
          {SOBRE_GS.map((paragrafo) => (
            <p key={paragrafo.slice(0, 24)} className="max-w-prose text-lg text-gelo-100">
              {paragrafo}
            </p>
          ))}
          <LinkSeta to="/como-funciona" className="mt-2">
            Entender como o C-Shield funciona
          </LinkSeta>
        </Revelar>
      </Secao>
    </>
  )
}
