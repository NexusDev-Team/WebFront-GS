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

// A linha de ataque, do atacante até o local. Sem C-Shield, chega inteira no local. Com C-Shield,
// ela SE ROMPE no escudo azul da borda: para ali, com faíscas, e nunca chega ao local.
// É decoração (aria-hidden): quem conta o que aconteceu é o texto da situação.
import { ATACANTE, RAIO_ESCUDO, RAIO_LOCAL, pontoAntesDoDestino } from './geometria.js'

// Três faíscas saindo do ponto de impacto, de volta na direção do atacante.
function faiscas(ponto, de) {
  const base = Math.atan2(de.y - ponto.y, de.x - ponto.x)
  return [-0.7, 0, 0.7].map((desvio) => ({
    x2: ponto.x + Math.cos(base + desvio) * 22,
    y2: ponto.y + Math.sin(base + desvio) * 22,
  }))
}

export default function LinhaAtaque({ local, protegido, reduzirMovimento }) {
  const fim = pontoAntesDoDestino(ATACANTE, local, protegido ? RAIO_ESCUDO + 4 : RAIO_LOCAL + 6)
  return (
    <g aria-hidden="true">
      <line
        x1={ATACANTE.x}
        y1={ATACANTE.y}
        x2={fim.x}
        y2={fim.y}
        stroke="var(--color-ataque)"
        strokeWidth={4}
        strokeLinecap="round"
        className={reduzirMovimento ? undefined : 'linha-fluxo'}
        strokeDasharray={reduzirMovimento ? '14 10' : undefined}
      />
      {protegido ? (
        <g stroke="var(--color-ataque)" strokeWidth={4} strokeLinecap="round" className="faisca-pulsa">
          {faiscas(fim, ATACANTE).map((f, i) => (
            <line key={i} x1={fim.x} y1={fim.y} x2={f.x2} y2={f.y2} />
          ))}
        </g>
      ) : null}
    </g>
  )
}
