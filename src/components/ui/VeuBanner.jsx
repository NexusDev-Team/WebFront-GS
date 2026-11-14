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

// Véus escuros postos sobre a imagem de fundo dos banners (Home e páginas internas): um degradê
// que escurece a imagem para o texto ler bem (de baixo para cima no celular, da esquerda no
// desktop) e uma faixa no topo que a funde ao cabeçalho. Só decoração.
export default function VeuBanner() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-noite-950/80 via-noite-950/45 to-noite-950/85 md:bg-linear-to-r md:from-noite-950 md:via-noite-950/55 md:to-transparent md:to-70%"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-noite-950 via-noite-950/60 to-transparent md:h-40"
      />
    </>
  )
}
