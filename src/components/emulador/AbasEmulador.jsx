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

import { useRef } from 'react'

// Abas do emulador: a câmara por dentro, as instalações e o dispositivo real. Segue o padrão de
// abas do WAI-ARIA: setas, Home e End trocam de aba e só a aba ativa entra na ordem do Tab.
// Os painéis das outras abas ficam montados (só escondidos), para não perderem o estado.
export default function AbasEmulador({ abas, ativa, aoMudar }) {
  const refs = useRef({})

  function aoTeclar(evento, indice) {
    const ultimo = abas.length - 1
    let novo = null
    if (evento.key === 'ArrowRight') novo = indice === ultimo ? 0 : indice + 1
    else if (evento.key === 'ArrowLeft') novo = indice === 0 ? ultimo : indice - 1
    else if (evento.key === 'Home') novo = 0
    else if (evento.key === 'End') novo = ultimo
    if (novo === null) return
    evento.preventDefault()
    aoMudar(abas[novo].id)
    refs.current[abas[novo].id]?.focus()
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Detalhes do emulador" className="flex gap-1 overflow-x-auto border-b border-borda">
        {abas.map((aba, indice) => {
          const selecionada = aba.id === ativa
          return (
            <button
              key={aba.id}
              ref={(no) => {
                refs.current[aba.id] = no
              }}
              role="tab"
              type="button"
              id={`aba-${aba.id}`}
              aria-selected={selecionada}
              aria-controls={`painel-${aba.id}`}
              tabIndex={selecionada ? 0 : -1}
              onClick={() => aoMudar(aba.id)}
              onKeyDown={(evento) => aoTeclar(evento, indice)}
              className={`-mb-px min-h-11 shrink-0 cursor-pointer border-b-2 px-3 text-sm font-semibold sm:px-4 sm:text-base transition-colors duration-200 ${
                selecionada
                  ? 'border-led-forte text-gelo-50'
                  : 'border-transparent text-gelo-300 hover:text-gelo-50'
              }`}
            >
              {aba.rotulo}
            </button>
          )
        })}
      </div>

      {abas.map((aba) => (
        <div
          key={aba.id}
          role="tabpanel"
          id={`painel-${aba.id}`}
          aria-labelledby={`aba-${aba.id}`}
          hidden={aba.id !== ativa}
        >
          {aba.conteudo}
        </div>
      ))}
    </div>
  )
}
