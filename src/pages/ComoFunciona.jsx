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

// Página Como funciona: o ciclo de proteção, a arquitetura em uma direção, os cinco
// estados e a explicação dos LEDs do Wokwi (enxuta: sem a origem da ideia). O texto fica em
// content/comoFunciona.js; a página só liga as seções.
import SecaoArquitetura from '../components/comoFunciona/SecaoArquitetura.jsx'
import SecaoCiclo from '../components/comoFunciona/SecaoCiclo.jsx'
import SecaoEstados from '../components/comoFunciona/SecaoEstados.jsx'
import SecaoWokwi from '../components/comoFunciona/SecaoWokwi.jsx'
import CabecalhoPagina from '../components/ui/CabecalhoPagina.jsx'
import bannerComoFunciona from '../assets/banner_comofunciona.webp'
import {
  ARQUITETURA,
  CABECALHO,
  CICLO,
  ESTADOS_DA_PAGINA,
  WOKWI,
} from '../content/comoFunciona.js'

export default function ComoFunciona() {
  return (
    <>
      <CabecalhoPagina
        imagem={{ src: bannerComoFunciona }}
        rotulo={CABECALHO.rotulo}
        titulo={CABECALHO.titulo}
        destaque={CABECALHO.destaque}
        subtitulo={CABECALHO.subtitulo}
      />
      <SecaoCiclo conteudo={CICLO} />
      <SecaoArquitetura conteudo={ARQUITETURA} />
      <SecaoEstados estados={ESTADOS_DA_PAGINA} />
      <SecaoWokwi conteudo={WOKWI} />
    </>
  )
}
