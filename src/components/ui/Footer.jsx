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

import { NOME_PRODUTO } from '../../domain/produto.js'

// Rodapé com a frase do produto e os links do Edge e do Wokwi (fonte de verdade do dispositivo).
const REPOSITORIO_EDGE = 'https://github.com/NexusDev-Team/C-Shield-Edge'
const WOKWI = 'https://wokwi.com/projects/480328417992209409'

function LinkExterno({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center text-gelo-300 underline underline-offset-4 hover:text-led-forte"
    >
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-borda bg-noite-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-titulo text-xl font-semibold text-gelo-50">
            Vê de longe. Só obedece de perto.
          </p>
          <p className="mt-1 font-mono text-sm text-gelo-300">
            {NOME_PRODUTO} · Nexus Dev · GS 2026.2
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6">
          <li>
            <LinkExterno href={REPOSITORIO_EDGE}>Repositório do Edge</LinkExterno>
          </li>
          <li>
            <LinkExterno href={WOKWI}>Simulação no Wokwi</LinkExterno>
          </li>
        </ul>
      </div>
    </footer>
  )
}
