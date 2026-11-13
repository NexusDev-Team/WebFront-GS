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

// Página Como funciona (W44, W26c): o ciclo de proteção, a arquitetura em uma direção, os cinco
// estados, a explicação dos LEDs do Wokwi e de onde vem a ideia. O texto fica
// em content/comoFunciona.js; a página só liga as seções.
import SecaoArquitetura from '../components/comoFunciona/SecaoArquitetura.jsx'
import SecaoCiclo from '../components/comoFunciona/SecaoCiclo.jsx'
import SecaoEstados from '../components/comoFunciona/SecaoEstados.jsx'
import SecaoOrigem from '../components/comoFunciona/SecaoOrigem.jsx'
import SecaoWokwi from '../components/comoFunciona/SecaoWokwi.jsx'
import CabecalhoPagina from '../components/ui/CabecalhoPagina.jsx'
import {
  ARQUITETURA,
  CABECALHO,
  CICLO,
  ESTADOS_DA_PAGINA,
  ORIGEM,
  WOKWI,
} from '../content/comoFunciona.js'

export default function ComoFunciona() {
  return (
    <>
      <CabecalhoPagina
        rotulo={CABECALHO.rotulo}
        titulo={CABECALHO.titulo}
        subtitulo={CABECALHO.subtitulo}
      />
      <SecaoCiclo conteudo={CICLO} />
      <SecaoArquitetura conteudo={ARQUITETURA} />
      <SecaoEstados estados={ESTADOS_DA_PAGINA} />
      <SecaoWokwi conteudo={WOKWI} />
      <SecaoOrigem conteudo={ORIGEM} />
    </>
  )
}
