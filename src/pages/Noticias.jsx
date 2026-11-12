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

import Pagina from '../components/ui/Pagina.jsx'

// Página Notícias: POR QUE o C-Shield existe. Uma capa no estilo de portal, a grade das outras
// matérias, a linha do tempo do caso e a chamada para o emulador. O conteúdo é fixo (src/content)
// e cada cartão leva à matéria original.
import { Link } from 'react-router-dom'
import CartaoNoticia from '../components/noticias/CartaoNoticia.jsx'
import LinhaDoTempo from '../components/noticias/LinhaDoTempo.jsx'
import ManchetePrincipal from '../components/noticias/ManchetePrincipal.jsx'
import BotaoLed from '../components/ui/BotaoLed.jsx'
import PainelVidro from '../components/ui/PainelVidro.jsx'
import Rotulo from '../components/ui/Rotulo.jsx'
import TituloLed from '../components/ui/TituloLed.jsx'
import { LINHA_DO_TEMPO } from '../content/linhaDoTempo.js'
import { noticiaDestaque, noticiasOrdenadas } from '../content/noticias.js'

export default function Noticias() {
  return (
    <Pagina className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <Rotulo>Por que o C-Shield existe</Rotulo>
        <TituloLed nivel={1}>
          Por que o C-Shield existe
        </TituloLed>
        <p className="max-w-2xl text-lg text-gelo-300">
          Em outubro e novembro de 2026, invasores entraram pela internet nos controladores de
          refrigeração de supermercados e de um banco de sangue na Europa e mandaram tudo esquentar.
          Ninguém entrou nos prédios. Estas são as notícias.
        </p>
      </header>

      <section aria-labelledby="capa">
        <h2 id="capa" className="sr-only">
          Manchete do dia
        </h2>
        <ManchetePrincipal noticia={noticiaDestaque()} />
      </section>

      <section aria-labelledby="mais-noticias" className="flex flex-col gap-4">
        <TituloLed nivel={2}>
          <span id="mais-noticias">Mais notícias</span>
        </TituloLed>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {noticiasOrdenadas().map((n) => (
            <li key={n.id}>
              <CartaoNoticia noticia={n} />
            </li>
          ))}
        </ul>
        <p className="text-sm text-gelo-300">
          Manchetes e links das fontes originais; resumos escritos pela equipe. Onde aparece
          &quot;Título da equipe&quot;, a página da fonte não abriu na nossa conferência, então o
          título descreve a matéria com as nossas palavras.
        </p>
      </section>

      <section aria-labelledby="linha-do-tempo" className="flex flex-col gap-4">
        <TituloLed nivel={2}>
          <span id="linha-do-tempo">Como tudo aconteceu</span>
        </TituloLed>
        <LinhaDoTempo eventos={LINHA_DO_TEMPO} />
      </section>

      <PainelVidro as="section" aria-labelledby="chamada" className="flex flex-col items-start gap-4 p-6 sm:p-8">
        <TituloLed nivel={2} variante="assumiu">
          <span id="chamada">Os monitores avisam. O C-Shield avisa e age.</span>
        </TituloLed>
        <p className="max-w-prose text-gelo-50">
          Na Europa, passaram 3h30 até alguém perceber. Um alerta às 2h da manhã ainda depende de
          alguém acordar e chegar a tempo. O C-Shield decide em segundos, ali mesmo, e só quem está
          presente consegue liberar. Veja como seria na sua cidade.
        </p>
        <BotaoLed as={Link} to="/emulador">
          Ataque uma cidade
        </BotaoLed>
      </PainelVidro>
    </Pagina>
  )
}
