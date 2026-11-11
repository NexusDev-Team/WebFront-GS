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

// Linha do tempo do caso: lista ordenada, com um marcador por evento. A cor mostra o tipo
// (vermelho = ataque, amarelo = alerta, azul forte = o C-Shield), mas o tipo também aparece
// escrito em cada item (W49).
const TIPOS = {
  ataque: { rotulo: 'Ataque', cor: 'var(--color-ataque)' },
  alerta: { rotulo: 'Alerta', cor: 'var(--color-atencao)' },
  cshield: { rotulo: 'C-Shield', cor: 'var(--color-led-forte)' },
}

export default function LinhaDoTempo({ eventos }) {
  return (
    <ol className="relative flex flex-col gap-6 border-l border-borda pl-6 sm:pl-8" aria-label="Linha do tempo do caso">
      {eventos.map((e) => {
        const tipo = TIPOS[e.tipo]
        return (
          <li key={`${e.data}-${e.titulo}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[31px] size-3.5 rounded-full border-2 border-noite-950 sm:-left-[39px]"
              style={{ backgroundColor: tipo.cor }}
            />
            <p className="flex flex-wrap items-center gap-2 font-mono text-sm text-gelo-300">
              <span className="text-gelo-50">{e.quando}</span>
              <span className="rounded-full border px-2 py-0.5 text-xs text-gelo-50" style={{ borderColor: tipo.cor }}>
                {tipo.rotulo}
              </span>
            </p>
            <h3 className="mt-1 text-lg font-semibold text-gelo-50">{e.titulo}</h3>
            <p className="max-w-prose text-gelo-300">{e.texto}</p>
          </li>
        )
      })}
    </ol>
  )
}
