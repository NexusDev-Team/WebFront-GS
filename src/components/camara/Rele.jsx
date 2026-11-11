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

// Uma etiqueta de relé do C-Shield (W20): qual relé é, o que ele comanda e o que está fazendo.
// O relé 1 corta o aquecedor; o relé 2 liga a ventoinha de emergência. Em repouso, o aparelho
// age como se o C-Shield não existisse (falha segura).
export default function Rele({ numero, comanda, agindo, acao, repouso }) {
  return (
    <p
      className="inline-flex items-center gap-2 rounded-md border bg-noite-900 px-3 py-1 font-mono text-sm text-gelo-50"
      style={{ borderColor: agindo ? 'var(--color-led-forte)' : 'var(--color-borda)' }}
    >
      <span aria-hidden="true" className="size-2.5 rounded-full" style={{ backgroundColor: agindo ? 'var(--color-led-forte)' : 'var(--color-gelo-300)' }} />
      Relé {numero} · {comanda}: {agindo ? acao : repouso}
    </p>
  )
}
