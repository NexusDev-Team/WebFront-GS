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

// Página inicial PROVISÓRIA (T7): vitrine dos componentes de ui/ com os tokens.
// O scrollytelling de verdade entra no T18.
import BotaoLed from '../components/ui/BotaoLed.jsx'
import Carregando from '../components/ui/Carregando.jsx'
import ErroMensagem from '../components/ui/ErroMensagem.jsx'
import Logo from '../components/ui/Logo.jsx'
import PainelVidro from '../components/ui/PainelVidro.jsx'
import Rotulo from '../components/ui/Rotulo.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import TituloLed from '../components/ui/TituloLed.jsx'

const ESTADOS = ['NORMAL', 'ATENCAO', 'BLOQUEIO', 'CRITICO', 'FALHA_SENSOR']

export default function Inicio() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <Rotulo>Cadeia do frio</Rotulo>
        <TituloLed nivel={1}>C-Shield</TituloLed>
        <p className="max-w-prose text-gelo-300">Vê de longe. Só obedece de perto.</p>
        <Logo variante="completa" />
      </section>

      <section className="flex flex-col gap-4">
        <TituloLed nivel={2}>Títulos</TituloLed>
        <PainelVidro className="flex flex-col gap-3 p-5">
          <TituloLed nivel={3} variante="repouso">Repouso: azul suave e estável</TituloLed>
          <TituloLed nivel={3} variante="ataque">Ataque: falha e glitch</TituloLed>
          <TituloLed nivel={3} variante="assumiu">O C-Shield assumiu</TituloLed>
        </PainelVidro>
      </section>

      <section className="flex flex-col gap-4">
        <TituloLed nivel={2}>Botões</TituloLed>
        <div className="flex flex-wrap gap-3">
          <BotaoLed variante="primario">Ataque uma cidade</BotaoLed>
          <BotaoLed variante="ataque" ariaLabel="Ataque de calor">4T4QU3 D3 C4L0R</BotaoLed>
          <BotaoLed variante="ataque" ariaLabel="Ataque de frio">4T4QU3 D3 FR10</BotaoLed>
          <BotaoLed variante="fantasma">Abrir simulador real</BotaoLed>
          <BotaoLed variante="primario" disabled>Desabilitado</BotaoLed>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <TituloLed nivel={2}>Estados</TituloLed>
        <div className="flex flex-wrap gap-3">
          {ESTADOS.map((estado) => (
            <StatusBadge key={estado} estado={estado} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <TituloLed nivel={2}>Carregando e erro</TituloLed>
        <Carregando texto="Lendo o dispositivo..." />
        <ErroMensagem
          mensagem="Não foi possível ler o dispositivo. Confira a conexão e tente de novo."
          aoTentarDeNovo={() => {}}
        />
      </section>
    </div>
  )
}
