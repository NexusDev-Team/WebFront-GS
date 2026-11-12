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

// Cartão de um integrante: foto, nome, função no projeto e RM. Se a foto ainda não foi colocada
// em public/equipe/ (ou não carrega), mostra um avatar com as iniciais no lugar.
import { useState } from 'react'
import PainelVidro from '../ui/PainelVidro.jsx'

export default function CartaoIntegrante({ integrante: m }) {
  const [semFoto, setSemFoto] = useState(false)
  return (
    <PainelVidro as="article" className="flex h-full flex-col gap-4 p-4">
      <div className="aspect-square w-full overflow-hidden rounded-lg border border-borda bg-noite-900">
        {semFoto ? (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-noite-900 to-noite-950">
            <span aria-hidden="true" className="font-titulo text-6xl font-bold text-led-forte">
              {m.iniciais}
            </span>
          </div>
        ) : (
          <img
            src={m.foto}
            alt={`Foto de ${m.nome}`}
            loading="lazy"
            onError={() => setSemFoto(true)}
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl leading-snug font-semibold text-gelo-50">{m.nome}</h3>
        <p className="text-gelo-300">{m.funcao}</p>
        <p className="font-mono text-sm text-gelo-50">{m.rm}</p>
      </div>
    </PainelVidro>
  )
}
