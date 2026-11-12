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

// Lista dos locais para telas estreitas (só no celular). O mapa continua ali como visão geral,
// mas os rótulos dele ficariam pequenos demais; aqui cada local é um botão de 44 px com nome,
// temperatura e situação em texto legível. Tocar escolhe o alvo, igual a tocar no mapa.
import { LOCAIS } from '../../domain/cidade.js'
import { situacao } from '../../domain/cidade-placar.js'
import { COR_SITUACAO, ROTULO_SITUACAO } from './rotulos.js'
import { formatarGraus as graus } from '../ui/formato.js'

export default function ListaLocais({ cidade, selecionadoId, aoSelecionar }) {
  return (
    <ul className="mt-3 flex flex-col gap-2 sm:hidden" aria-label="Locais da cidade">
      {LOCAIS.map((def) => {
        const local = cidade.locais[def.id]
        const s = situacao(local)
        const ativo = selecionadoId === def.id
        return (
          <li key={def.id}>
            <button
              type="button"
              aria-pressed={ativo}
              onClick={() => aoSelecionar(def.id)}
              className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-noite-900 px-3 py-2 text-left text-gelo-50"
              style={{ borderColor: ativo ? 'var(--color-gelo-50)' : 'var(--color-borda)' }}
            >
              <span>
                <span className="block font-semibold">{def.nome}</span>
                <span className="flex items-center gap-2 text-sm text-gelo-300">
                  <span aria-hidden="true" className="size-2.5 rounded-full" style={{ backgroundColor: COR_SITUACAO[s] }} />
                  {ROTULO_SITUACAO[s]}
                  {local.protegido ? ' · com C-Shield' : ' · sem C-Shield'}
                </span>
              </span>
              <span className="shrink-0 font-mono text-lg whitespace-nowrap">{graus(local.temperatura)} °C</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
