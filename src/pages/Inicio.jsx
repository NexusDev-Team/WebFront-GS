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

// Página inicial: banner, monitoramento (demonstração), o problema, o painel do C-Shield, a
// solução e a chamada final (decisão de 12/11: seguir o mockup). A leitura simulada fica aqui
// para as seções que a usam compartilharem os mesmos números.
import Banner from '../components/inicio/Banner.jsx'
import ChamadaFinal from '../components/inicio/ChamadaFinal.jsx'
import SecaoMonitoramento from '../components/inicio/SecaoMonitoramento.jsx'
import SecaoPainel from '../components/inicio/SecaoPainel.jsx'
import SecaoProblema from '../components/inicio/SecaoProblema.jsx'
import SecaoSolucao from '../components/inicio/SecaoSolucao.jsx'
import { BANNER, CHAMADA, DEMO, PAINEL, PROBLEMA, SOLUCAO } from '../content/inicio.js'
import { useLeituraDemo } from '../hooks/useLeituraDemo.js'

export default function Inicio() {
  const serie = useLeituraDemo(DEMO)
  const temperaturas = serie.map((leitura) => leitura.temperatura)

  return (
    <>
      <Banner conteudo={BANNER} />
      <SecaoMonitoramento temperaturas={temperaturas} />
      <SecaoProblema conteudo={PROBLEMA} />
      <SecaoPainel conteudo={PAINEL} serie={serie} />
      <SecaoSolucao conteudo={SOLUCAO} />
      <ChamadaFinal conteudo={CHAMADA} />
    </>
  )
}
