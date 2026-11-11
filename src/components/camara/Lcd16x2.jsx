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

// O visor LCD 16x2 do C-Shield (W20, W21). Mostra exatamente os textos do firmware, em 2 linhas
// de 16 colunas (completa com espaço, como o aparelho). Fonte VT323, verde de LCD. Para leitor
// de tela, o visor inteiro é uma imagem com o texto das duas linhas.
const COLUNAS = 16

export default function Lcd16x2({ linhas }) {
  const [l1, l2] = linhas
  return (
    <div
      role="img"
      aria-label={`Visor do C-Shield. Linha 1: ${l1}. Linha 2: ${l2 || 'vazia'}.`}
      className="inline-block rounded-lg border-4 border-noite-900 bg-lcd-fundo px-4 py-3 shadow-inner"
    >
      <div aria-hidden="true" className="font-lcd text-3xl leading-tight whitespace-pre text-lcd-texto sm:text-4xl">
        <div>{l1.padEnd(COLUNAS)}</div>
        <div>{(l2 ?? '').padEnd(COLUNAS)}</div>
      </div>
    </div>
  )
}
