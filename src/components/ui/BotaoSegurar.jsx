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

// O botão de segurar (W23): "Só obedece de perto" virado em gesto. É preciso SEGURAR por 3 s,
// com a barra de 16 blocos enchendo como no visor do aparelho; soltar antes cancela. Funciona com
// mouse, toque e teclado (Espaço ou Enter). O gesto vem de useSegurar, que o painel usa para
// também mostrar o progresso no LCD; aqui só se desenha.
const BLOCOS = 16

export default function BotaoSegurar({ segurar, rotulo = 'Segure 3 s para liberar', desabilitado = false }) {
  const { progresso, segurando, props } = segurar
  const cheios = Math.floor(progresso * BLOCOS)
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={desabilitado}
        {...props}
        onContextMenu={(e) => e.preventDefault()}
        className="flex min-h-11 w-full max-w-sm cursor-pointer touch-none flex-col items-center justify-center gap-1 rounded-lg border border-led-forte bg-noite-900 px-4 py-3 font-titulo text-base font-semibold text-gelo-50 transition-colors duration-200 select-none hover:bg-noite-950 disabled:cursor-not-allowed disabled:opacity-50"
        style={segurando ? { backgroundColor: 'var(--color-noite-950)' } : undefined}
      >
        <span>{segurando ? 'Continue segurando...' : rotulo}</span>
        <span aria-hidden="true" className="font-mono text-lg tracking-widest text-led-forte">
          {'█'.repeat(cheios)}
          {'░'.repeat(BLOCOS - cheios)}
        </span>
      </button>
      <div role="progressbar" aria-label="Progresso da liberação" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progresso * 100)} className="sr-only" />
    </div>
  )
}
