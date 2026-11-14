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

// Página Problema (antes Notícias): POR QUE o C-Shield existe. Ordem: cabeçalho, a manchete (sem imagem), a linha do
// tempo do caso, "E na sua cidade?" (cadastro de câmaras do bairro, o CRUD em API externa) com a
// chamada para o emulador logo abaixo, e por último as outras matérias (3 à vista e um botão para ver todas). O conteúdo é fixo
// (src/content) e cada cartão leva à matéria original.
import { Link } from 'react-router-dom'
import SecaoSuaCidade from '../components/camaras/SecaoSuaCidade.jsx'
import ListaMaterias from '../components/noticias/ListaMaterias.jsx'
import LinhaDoTempo from '../components/noticias/LinhaDoTempo.jsx'
import ManchetePrincipal from '../components/noticias/ManchetePrincipal.jsx'
import BotaoLed from '../components/ui/BotaoLed.jsx'
import CabecalhoPagina from '../components/ui/CabecalhoPagina.jsx'
import PainelVidro from '../components/ui/PainelVidro.jsx'
import Revelar from '../components/ui/Revelar.jsx'
import Secao from '../components/ui/Secao.jsx'
import { LINHA_DO_TEMPO } from '../content/linhaDoTempo.js'
import { noticiaDestaque, noticiasOrdenadas } from '../content/noticias.js'

export default function Problema() {
  return (
    <>
      <CabecalhoPagina
        rotulo="O problema"
        titulo="Invadiram o frio"
        destaque="pela internet"
        subtitulo="Em 2026, invasores mandaram esquentar supermercados e um banco de sangue na Europa. Ninguém entrou nos prédios."
      />

      <Secao rotuloAria="Manchete do dia">
        <Revelar>
          <ManchetePrincipal noticia={noticiaDestaque()} />
        </Revelar>
      </Secao>

      <Secao id="linha-do-tempo" rotulo="Linha do tempo" titulo="Como tudo aconteceu">
        <Revelar>
          <LinhaDoTempo eventos={LINHA_DO_TEMPO} />
        </Revelar>
      </Secao>

      <SecaoSuaCidade>
        <Revelar className="mt-16">
          <PainelVidro as="section" aria-labelledby="chamada" className="flex flex-col items-start gap-4 p-6 sm:p-8">
            <h3 id="chamada" className="led-forte text-2xl font-semibold text-balance">
              Os monitores avisam. O C-Shield avisa e age.
            </h3>
            <p className="max-w-prose text-gelo-50">
              Na Europa, passaram 3h30 até alguém perceber. O C-Shield decide em segundos, ali mesmo, e
              só quem está presente consegue liberar.
            </p>
            <BotaoLed as={Link} to="/emulador" seta>
              Ataque uma cidade
            </BotaoLed>
          </PainelVidro>
        </Revelar>
      </SecaoSuaCidade>

      <Secao id="mais-noticias" rotulo="Mais notícias" titulo="Outras matérias do caso">
        <ListaMaterias noticias={noticiasOrdenadas()} />
      </Secao>
    </>
  )
}
