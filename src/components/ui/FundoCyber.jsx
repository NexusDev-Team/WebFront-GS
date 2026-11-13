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

import { useEmTela } from '../../hooks/useEmTela.js'

// Fundo decorativo "cyber" (Design System v1.0): colunas de binários nas bordas, com 8 a 18% de
// opacidade e subida lenta, e circuitos finos com um brilho que percorre as linhas. É só
// enfeite (aria-hidden, sem foco). Pausa fora da tela (useEmTela) e para com
// prefers-reduced-motion (efeitos.css). No celular fica só uma coluna, para ser ainda mais discreto.
const BLOCO = '1 0 0 1 1 0 1 0 0 0 1 1 0 1 0 0 1 0 1 1 0 0 1 0 1 1 1 0 0 1 0 1 0 0 1 1 0 1 0 1'
  .split(' ')
  .join('\n')

function ColunaBinaria({ className }) {
  // O bloco aparece duas vezes: a animação sobe 50% e recomeça sem salto.
  return (
    <div className={`binario-coluna ${className}`}>
      <pre className="binario-sobe font-mono text-sm leading-6">
        {BLOCO}
        {'\n'}
        {BLOCO}
      </pre>
    </div>
  )
}

export default function FundoCyber({ className = '' }) {
  const [ref, visivel] = useEmTela()
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-pausado={!visivel}
      className={`fundo-cyber pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <ColunaBinaria className="absolute top-0 right-[3%] h-full" />
      <ColunaBinaria className="absolute top-0 left-[3%] hidden h-full md:block" />
      <svg
        className="absolute inset-0 hidden size-full md:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="var(--color-led-fraco)" strokeWidth="1.2">
          <path d="M0 210 H96 L140 164 H300" />
          <path d="M1440 640 H1330 L1286 684 H1120" />
        </g>
        <g stroke="var(--color-gelo-azul)" strokeWidth="1.6" strokeLinecap="round">
          <path className="circuito-brilho" pathLength="100" d="M0 210 H96 L140 164 H300" />
          <path className="circuito-brilho circuito-brilho-b" pathLength="100" d="M1440 640 H1330 L1286 684 H1120" />
        </g>
      </svg>
    </div>
  )
}
