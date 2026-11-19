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

// Estado do C-Shield em cor E texto: nunca só pela cor.
// O texto fica em gelo-50 (contraste alto); a cor do estado vai no ponto e na borda.
// Nomes de estado canônicos, iguais ao Edge. BLOQUEIO é azul, como o LED do aparelho.
const ESTADOS = {
  NORMAL: { rotulo: 'Normal', cor: 'var(--color-ok)' },
  ATENCAO: { rotulo: 'Atenção', cor: 'var(--color-atencao)' },
  BLOQUEIO: { rotulo: 'Bloqueio', cor: 'var(--color-led-forte)' },
  CRITICO: { rotulo: 'Crítico', cor: 'var(--color-critico)' },
  FALHA_SENSOR: { rotulo: 'Falha de sensor', cor: 'var(--color-atencao)' },
}

export default function StatusBadge({ estado, className = '' }) {
  const info = ESTADOS[estado] ?? { rotulo: 'Sem leitura', cor: 'var(--color-gelo-300)' }
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border bg-noite-900 px-3 py-1 font-mono text-sm text-gelo-50 ${className}`}
      style={{ borderColor: info.cor }}
    >
      <span aria-hidden="true" className="size-2.5 rounded-full" style={{ backgroundColor: info.cor }} />
      {info.rotulo}
    </span>
  )
}
