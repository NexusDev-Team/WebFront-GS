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

// O LED de estado do C-Shield (W22): a cor E o que ela quer dizer, escritos (W49). Azul fixo
// enquanto houver bloqueio. O amarelo piscando pisca devagar (menos de 1 vez por segundo) e para
// com prefers-reduced-motion. Serve ao emulador e, depois, à leitura do dispositivo real.
const LEDS = {
  verde: { cor: 'var(--color-ok)', texto: 'Verde: tudo normal' },
  amarelo: { cor: 'var(--color-atencao)', texto: 'Amarelo: atenção' },
  'amarelo-pisca': { cor: 'var(--color-atencao)', texto: 'Amarelo piscando: sensor sem leitura' },
  vermelho: { cor: 'var(--color-critico)', texto: 'Vermelho: temperatura crítica' },
  azul: { cor: 'var(--color-led-forte)', texto: 'Azul fixo: C-Shield no controle' },
}

export default function LedEstado({ cor, className = '' }) {
  const led = LEDS[cor] ?? LEDS.verde
  return (
    <p className={`flex items-center gap-3 text-gelo-50 ${className}`}>
      <span
        aria-hidden="true"
        className={`size-6 shrink-0 rounded-full ${cor === 'amarelo-pisca' ? 'led-pisca' : ''}`}
        style={{ backgroundColor: led.cor, boxShadow: '0 0 0 3px rgba(248, 250, 252, 0.1), inset 0 1px 1px rgba(248, 250, 252, 0.4)' }}
      />
      <span>
        <span className="font-mono text-xs text-gelo-300">LED </span>
        {led.texto}
      </span>
    </p>
  )
}
