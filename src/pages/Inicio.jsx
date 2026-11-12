/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Vision. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */

// Página inicial: banner, o problema e a solução, em seções simples (decisão de 12/11).
import Banner from '../components/inicio/Banner.jsx'
import SecaoProblema from '../components/inicio/SecaoProblema.jsx'
import SecaoSolucao from '../components/inicio/SecaoSolucao.jsx'
import { BANNER, PROBLEMA, SOLUCAO } from '../content/inicio.js'

export default function Inicio() {
  return (
    <>
      <Banner conteudo={BANNER} />
      <SecaoProblema conteudo={PROBLEMA} />
      <SecaoSolucao conteudo={SOLUCAO} />
    </>
  )
}
