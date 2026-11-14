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

// Página Nexus Dev: quem fez o C-Shield. Numa tela só (decisão de 14/11): o cabeçalho e uma seção
// com a equipe à esquerda (tecnologias e, embaixo, os cinco integrantes) e o propósito à direita.
// O texto do propósito, escrito pela equipe, fica em src/content/nexusDev.js.
import ListaEquipe from '../components/equipe/ListaEquipe.jsx'
import ListaTecnologias from '../components/equipe/ListaTecnologias.jsx'
import CabecalhoPagina from '../components/ui/CabecalhoPagina.jsx'
import bannerEquipe from '../assets/banner_equipe.webp'
import LinkSeta from '../components/ui/LinkSeta.jsx'
import Revelar from '../components/ui/Revelar.jsx'
import Secao from '../components/ui/Secao.jsx'
import { NEXUS } from '../content/inicio.js'
import { PROPOSITO } from '../content/nexusDev.js'

export default function NexusDev() {
  return (
    <>
      <CabecalhoPagina
        imagem={{ src: bannerEquipe }}
        rotulo="A equipe"
        titulo="Nexus Dev"
        destaque="Quem constrói o C-Shield"
        subtitulo="Cinco estudantes de Engenharia de Software da FIAP, no primeiro ano, criando o C-Shield para a Global Solution 2026.2."
      />

      <Secao rotuloAria="A equipe e o nosso propósito" compacta className="md:pb-28">
        {/* Duas linhas no desktop: o título "A equipe" fica sozinho na primeira, e o conteúdo da
            esquerda e o propósito começam juntos na segunda, na mesma altura. */}
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr]">
          <div className="nevoa-texto lg:col-start-1 lg:row-start-1">
            <Revelar className="flex flex-col gap-3">
              <p className="rotulo-tecnico">Equipe</p>
              <h2 id="titulo-equipe" className="text-[clamp(1.875rem,3.5vw,3rem)] leading-[1.1] font-semibold text-gelo-50">
                A equipe
              </h2>
            </Revelar>
          </div>

          <div className="nevoa-texto lg:col-start-1 lg:row-start-2">
            <Revelar atraso={0.05} className="flex flex-col gap-6">
              <div>
                <p className="rotulo-tecnico mb-3">Tecnologias</p>
                <ListaTecnologias tecnologias={NEXUS.tecnologias} />
              </div>
              <div>
                <p className="rotulo-tecnico mb-3">Integrantes</p>
                <ListaEquipe />
              </div>
            </Revelar>
          </div>

          <div className="nevoa-texto lg:col-start-2 lg:row-start-2">
            <Revelar atraso={0.1} className="flex flex-col items-start gap-6">
              <div className="flex flex-col gap-3">
                <p className="rotulo-tecnico">Propósito</p>
                <h2 id="titulo-proposito" className="text-[clamp(1.875rem,3.5vw,3rem)] leading-[1.1] font-semibold text-gelo-50">
                  Nosso propósito
                </h2>
              </div>
              <p className="border-l-2 border-ciano pl-6 text-lg leading-relaxed text-gelo-100 sm:text-xl">{PROPOSITO}</p>
              <LinkSeta to="/como-funciona">Entender como o C-Shield funciona</LinkSeta>
            </Revelar>
          </div>
        </div>
      </Secao>
    </>
  )
}
