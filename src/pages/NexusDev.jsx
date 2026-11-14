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

// Página Nexus Dev: quem fez o C-Shield. Enxuta (decisão de 13/11): o cabeçalho, os cinco
// integrantes ao lado das tecnologias e uma única seção "Nosso propósito", que junta a visão e os
// valores da equipe. Textos em src/content (rascunho para a equipe revisar).
import ListaEquipe from '../components/equipe/ListaEquipe.jsx'
import ListaTecnologias from '../components/equipe/ListaTecnologias.jsx'
import CabecalhoPagina from '../components/ui/CabecalhoPagina.jsx'
import LinkSeta from '../components/ui/LinkSeta.jsx'
import Revelar from '../components/ui/Revelar.jsx'
import Secao from '../components/ui/Secao.jsx'
import { NEXUS } from '../content/inicio.js'
import { CULTURA, VISAO } from '../content/nexusDev.js'

export default function NexusDev() {
  return (
    <>
      <CabecalhoPagina
        rotulo="A equipe"
        titulo="Nexus Dev"
        destaque="Quem constrói o C-Shield"
        subtitulo="Cinco estudantes de Engenharia de Software da FIAP, no primeiro ano, criando o C-Shield para a Global Solution 2026.2."
      />

      <Secao id="titulo-integrantes" rotulo="Integrantes" titulo="A equipe">
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

      <Secao id="titulo-proposito" rotulo="Propósito" titulo="Nosso propósito">
        <div className="flex flex-col gap-12">
          <Revelar>
            <p className="max-w-4xl border-l-2 border-ciano pl-6 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-snug text-gelo-50">
              {VISAO}
            </p>
          </Revelar>
          <Revelar atraso={0.1}>
            <ul className="divide-y divide-borda border-y border-borda">
              {CULTURA.map((c) => (
                <li key={c.titulo} className="grid gap-2 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
                  <h3 className="text-xl font-semibold text-gelo-50">{c.titulo}</h3>
                  <p className="text-gelo-300">{c.texto}</p>
                </li>
              ))}
            </ul>
          </Revelar>
          <Revelar atraso={0.15}>
            <LinkSeta to="/como-funciona">Entender como o C-Shield funciona</LinkSeta>
          </Revelar>
        </div>
      </Secao>
    </>
  )
}
