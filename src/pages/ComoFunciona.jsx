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


// Página Como funciona. Ainda é provisória: o conteúdo (os 4 verbos, os 5 estados, a arquitetura
// em uma direção e a explicação dos LEDs do Wokwi) entra na tarefa T19.
import Pagina from '../components/ui/Pagina.jsx'
import Rotulo from '../components/ui/Rotulo.jsx'
import TituloLed from '../components/ui/TituloLed.jsx'

export default function ComoFunciona() {
  return (
    <Pagina as="section" className="flex flex-col gap-4">
      <Rotulo>O dispositivo</Rotulo>
      <TituloLed nivel={1}>Como funciona</TituloLed>
      <p className="max-w-prose text-lg text-gelo-300">
        Medir, decidir, assumir e alertar. Esta página está em construção.
      </p>
    </Pagina>
  )
}
