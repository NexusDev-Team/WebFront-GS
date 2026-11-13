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

// Página Notícias: POR QUE o C-Shield existe. Ordem: cabeçalho, a manchete (sem imagem), a linha do
// tempo do caso, "E na sua cidade?" (cadastro de câmaras do bairro, o CRUD em API externa) com a
// chamada para o emulador logo abaixo, e por último as outras matérias. O conteúdo é fixo
// (src/content) e cada cartão leva à matéria original.
import { Link } from 'react-router-dom'
import SecaoSuaCidade from '../components/camaras/SecaoSuaCidade.jsx'
import CartaoNoticia from '../components/noticias/CartaoNoticia.jsx'
import LinhaDoTempo from '../components/noticias/LinhaDoTempo.jsx'
import ManchetePrincipal from '../components/noticias/ManchetePrincipal.jsx'
import BotaoLed from '../components/ui/BotaoLed.jsx'
import CabecalhoPagina from '../components/ui/CabecalhoPagina.jsx'
import PainelVidro from '../components/ui/PainelVidro.jsx'
import Revelar from '../components/ui/Revelar.jsx'
import Secao from '../components/ui/Secao.jsx'
import { LINHA_DO_TEMPO } from '../content/linhaDoTempo.js'
import { noticiaDestaque, noticiasOrdenadas } from '../content/noticias.js'

export default function Noticias() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Notícias"
        titulo="Por que o C-Shield existe"
        subtitulo="Em outubro e novembro de 2026, invasores entraram pela internet nos controladores de refrigeração de supermercados e de um banco de sangue na Europa e mandaram tudo esquentar. Ninguém entrou nos prédios. Estas são as notícias."
      />

      <Secao rotuloAria="Manchete do dia">
        <Revelar>
          <ManchetePrincipal noticia={noticiaDestaque()} />
        </Revelar>
      </Secao>

      <Secao id="linha-do-tempo" rotulo="Linha do tempo" titulo="Como tudo aconteceu" faixa>
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
              Na Europa, passaram 3h30 até alguém perceber. Um alerta às 2h da manhã ainda depende de
              alguém acordar e chegar a tempo. O C-Shield decide em segundos, ali mesmo, e só quem está
              presente consegue liberar. Veja como seria na sua cidade.
            </p>
            <BotaoLed as={Link} to="/emulador" seta>
              Ataque uma cidade
            </BotaoLed>
          </PainelVidro>
        </Revelar>
      </SecaoSuaCidade>

      <Secao id="mais-noticias" rotulo="Mais notícias" titulo="Outras matérias do caso" faixa>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {noticiasOrdenadas().map((n, indice) => (
            <li key={n.id}>
              <Revelar atraso={(indice % 3) * 0.08} className="h-full">
                <CartaoNoticia noticia={n} />
              </Revelar>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-sm text-gelo-300">
          Manchetes e links das fontes originais; resumos escritos pela equipe. Onde aparece
          &quot;Título da equipe&quot;, a página da fonte não abriu na nossa conferência, então o
          título descreve a matéria com as nossas palavras.
        </p>
      </Secao>
    </>
  )
}
