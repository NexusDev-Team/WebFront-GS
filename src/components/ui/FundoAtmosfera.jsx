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

// Fundo atmosférico do site: uma camada fixa atrás de todas as páginas, com brilho glacial, azul
// profundo, grade técnica sutil e grão de gelo (classe .fundo-atmosfera, em efeitos.css). Por ser
// uma só camada fixa, não há emenda entre as seções, e como não anima nem usa blur, não pesa na
// rolagem. É só enfeite (aria-hidden).
export default function FundoAtmosfera() {
  return <div aria-hidden="true" className="fundo-atmosfera pointer-events-none fixed inset-0 -z-10" />
}
