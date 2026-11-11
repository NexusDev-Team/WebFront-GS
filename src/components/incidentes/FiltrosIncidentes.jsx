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

// Filtros da lista de incidentes (W31): situação e tipo, em grupos de botões de escolha.
// Cada opção é um rádio de verdade (teclado e leitor de tela de graça), com alvo de 44 px.
import { ROTULOS, STATUS, TIPOS } from '../../domain/incidentes.js'

const OPCOES_STATUS = [['', 'Todos'], ...STATUS.map((s) => [s, ROTULOS.status[s]])]
const OPCOES_TIPO = [['', 'Todos'], ...TIPOS.map((t) => [t, ROTULOS.tipo[t]])]

function Grupo({ legenda, nome, opcoes, valor, aoEscolher }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 font-mono text-sm text-gelo-300">{legenda}</legend>
      <div className="flex flex-wrap gap-2">
        {opcoes.map(([v, rotulo]) => (
          <label
            key={v || 'todos'}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-borda bg-noite-900 px-4 text-gelo-50 transition-colors duration-200 hover:border-led-forte has-[:checked]:border-led-forte has-[:checked]:bg-led-forte has-[:checked]:text-noite-950 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-led-forte"
          >
            <input
              type="radio"
              name={nome}
              value={v}
              checked={valor === v}
              onChange={() => aoEscolher(v)}
              className="sr-only"
            />
            {rotulo}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function FiltrosIncidentes({ filtros, aoMudar }) {
  return (
    <form
      className="flex flex-wrap gap-x-8 gap-y-4"
      aria-label="Filtros da lista"
      onSubmit={(e) => e.preventDefault()}
    >
      <Grupo
        legenda="Situação"
        nome="filtro-status"
        opcoes={OPCOES_STATUS}
        valor={filtros.status}
        aoEscolher={(status) => aoMudar({ ...filtros, status })}
      />
      <Grupo
        legenda="Tipo de ataque"
        nome="filtro-tipo"
        opcoes={OPCOES_TIPO}
        valor={filtros.tipo}
        aoEscolher={(tipo) => aoMudar({ ...filtros, tipo })}
      />
    </form>
  )
}
