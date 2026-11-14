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

import fumaca from '../../assets/fundo-fumaca.jpg'
import ChuvaBinaria from './ChuvaBinaria.jsx'

// Fundo único do site, uma camada fixa atrás de todas as páginas (por isso a rolagem parece uma
// tela só, sem emendas entre as seções): base noite com brilhos glaciais (.fundo-atmosfera), a
// fumaça gelada da mesma arte do banner (.fumaca-fundo) e a chuva de binários discreta em canvas.
// É só enfeite (aria-hidden, sem foco, sem cliques).
export default function FundoAtmosfera() {
  return (
    <div aria-hidden="true" className="fundo-atmosfera pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="fumaca-fundo absolute inset-0" style={{ '--imagem-fumaca': `url(${fumaca})` }} />
      <ChuvaBinaria />
    </div>
  )
}
