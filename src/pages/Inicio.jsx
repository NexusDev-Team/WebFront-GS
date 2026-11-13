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

// Página inicial (Design System v1.0): hero, o problema, como funciona, monitoramento, a simulação
// de ataque e a equipe, nessa ordem (a história do produto, uma etapa por vez). A leitura
// simulada fica aqui para as seções que a usam compartilharem os mesmos números.
import Banner from '../components/inicio/Banner.jsx'
import ChamadaFinal from '../components/inicio/ChamadaFinal.jsx'
import SecaoMonitoramento from '../components/inicio/SecaoMonitoramento.jsx'
import SecaoNexusDev from '../components/inicio/SecaoNexusDev.jsx'
import SecaoProblema from '../components/inicio/SecaoProblema.jsx'
import SecaoSolucao from '../components/inicio/SecaoSolucao.jsx'
import { BANNER, CHAMADA, DEMO, NEXUS, PROBLEMA, SOLUCAO } from '../content/inicio.js'
import { useLeituraDemo } from '../hooks/useLeituraDemo.js'

export default function Inicio() {
  const serie = useLeituraDemo(DEMO)

  return (
    <>
      <Banner conteudo={BANNER} />
      <SecaoProblema conteudo={PROBLEMA} />
      <SecaoSolucao conteudo={SOLUCAO} />
      <SecaoMonitoramento serie={serie} />
      <ChamadaFinal conteudo={CHAMADA} />
      <SecaoNexusDev conteudo={NEXUS} />
    </>
  )
}
