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

// O mapa SVG da cidade (W10 a W14): a central no meio e os 5 locais (o atacante fica na zona de cima do card). As linhas
// de ataque saem do atacante; as de dados vão só dos locais com C-Shield até a central. Nunca há
// linha entre locais. O aviso de ataque coordenado aparece em cima do mapa, na central.
import { LOCAIS } from '../../domain/cidade.js'
import { situacao } from '../../domain/cidade-placar.js'
import Central from './Central.jsx'
import FundoMapa from './FundoMapa.jsx'
import { VIEWBOX } from './geometria.js'
import LinhaAtaque from './LinhaAtaque.jsx'
import LinhaDados from './LinhaDados.jsx'
import ListaLocais from './ListaLocais.jsx'
import LocalNoMapa from './LocalNoMapa.jsx'

export default function MapaCidade({ cidade, selecionadoId, aoSelecionar, reduzirMovimento }) {
  const { coordenado } = cidade
  return (
    <div className="relative">
      <svg
        viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.largura} ${VIEWBOX.altura}`}
        role="group"
        aria-label="Mapa da cidade com cinco locais"
        className="h-auto w-full"
      >
        {/* O fundo: ruas, quarteirões, avenida e rio, como um mapa de verdade */}
        <FundoMapa />

        {/* A cidade: um contorno tracejado, com o atacante do lado de fora */}
        <rect
          x={30}
          y={96}
          width={940}
          height={484}
          rx={28}
          fill="none"
          stroke="var(--color-borda)"
          strokeWidth={2}
          strokeDasharray="10 10"
        />

        {LOCAIS.filter((l) => cidade.locais[l.id].protegido).map((def) => (
          <LinhaDados key={`dados-${def.id}`} local={def} reduzirMovimento={reduzirMovimento} />
        ))}
        {LOCAIS.filter((l) => cidade.locais[l.id].ordem !== 'NORMAL').map((def) => (
          <LinhaAtaque
            key={`ataque-${def.id}`}
            local={def}
            protegido={cidade.locais[def.id].protegido}
            reduzirMovimento={reduzirMovimento}
          />
        ))}

        <Central />
        {LOCAIS.map((def) => (
          <LocalNoMapa
            key={def.id}
            def={def}
            local={cidade.locais[def.id]}
            situacaoLocal={situacao(cidade.locais[def.id])}
            selecionado={selecionadoId === def.id}
            aoSelecionar={aoSelecionar}
          />
        ))}
      </svg>

      <ListaLocais cidade={cidade} selecionadoId={selecionadoId} aoSelecionar={aoSelecionar} />

      {/* No celular o aviso fica abaixo do mapa; em telas maiores, em cima dele, perto da central */}
      <div role="status" className="mt-2 flex justify-center sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-[17%] sm:mt-0 sm:px-2">
        {coordenado ? (
          <p className="max-w-xs rounded-lg border border-ataque bg-noite-950 px-3 py-2 text-center font-semibold text-gelo-50 sm:max-w-md">
            <span aria-hidden="true" className="mr-1 font-mono text-ataque">
              [alerta]
            </span>
            Ataque coordenado detectado: {coordenado.n} locais em {coordenado.segundos} s
          </p>
        ) : null}
      </div>
    </div>
  )
}
