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

import FlocoNeve from '../ui/FlocoNeve.jsx'
import Logo from '../ui/Logo.jsx'
import { formatarGraus } from '../ui/formato.js'

// Ícone de sinal: as ondas saem do aparelho para a central. Só envio, nunca recepção.
function IconeSinal() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="size-9 text-led-forte" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="16" cy="25" r="2" fill="currentColor" stroke="none" />
      <path d="M10.5 19.5a7.8 7.8 0 0 1 11 0" />
      <path d="M6 15a14 14 0 0 1 20 0" />
      <path d="M1.8 10.6a20 20 0 0 1 28.4 0" opacity="0.55" />
    </svg>
  )
}

// O "Display C-Shield" do mockup: um cartão de vidro fosco com o modo e a temperatura alvo, como o
// visor do aparelho. A temperatura alvo vem do perfil da câmara (domain/perfis.js).
export default function DisplayCShield({ conteudo, temperaturaAlvo }) {
  return (
    <article className="vidro-fosco flex min-h-80 flex-col justify-between gap-10 overflow-hidden p-6 sm:p-8">
      <FlocoNeve className="absolute top-[38%] left-1/2 size-44 -translate-x-1/2 -translate-y-1/2 text-led-forte/15" />
      <div className="relative flex items-start justify-between">
        <IconeSinal />
        <Logo variante="escudo" className="h-9! opacity-70" />
      </div>
      <div className="relative flex flex-col gap-3">
        <h3 className="text-3xl font-bold text-balance text-gelo-50">{conteudo.titulo}</h3>
        <p className="text-lg text-gelo-300">
          Modo: <strong className="font-semibold text-gelo-50">{conteudo.modo}</strong> · {conteudo.legendaAlvo}:{' '}
          <strong className="font-semibold text-gelo-50 tabular-nums">{formatarGraus(temperaturaAlvo)} °C</strong>
        </p>
      </div>
    </article>
  )
}
