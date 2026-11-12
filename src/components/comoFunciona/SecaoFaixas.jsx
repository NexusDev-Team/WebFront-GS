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

import { PERFIS_FIRMWARE, faixaParaMostrar } from '../../domain/perfis.js'
import TituloSecao from '../ui/TituloSecao.jsx'
import { formatarGraus } from '../ui/formato.js'

// "Faixas seguras": um cartão por produto, com a faixa vinda do firmware (domain/perfis.js) e a
// etiqueta "gravada no dispositivo". Só leitura: este site nunca altera uma faixa.
function textoDaFaixa(perfil) {
  const { minimo, maximo } = faixaParaMostrar(perfil)
  return minimo === null
    ? `até ${formatarGraus(maximo)} °C`
    : `${formatarGraus(minimo)} a ${formatarGraus(maximo)} °C`
}

export default function SecaoFaixas({ conteudo }) {
  return (
    <section
      id={conteudo.id}
      aria-labelledby="titulo-faixas"
      className="scroll-mt-20 border-t border-borda bg-noite-900/50 py-16 sm:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <TituloSecao id="titulo-faixas" subtitulo={conteudo.subtitulo}>
          {conteudo.titulo}
        </TituloSecao>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(PERFIS_FIRMWARE).map((perfil) => (
            <li key={perfil.id} className="cartao flex flex-col gap-3 p-6">
              <h3 className="text-lg font-bold text-gelo-50">{perfil.nome}</h3>
              <p className="font-titulo text-3xl leading-none font-bold tracking-tight text-gelo-50 tabular-nums">
                {textoDaFaixa(perfil)}
              </p>
              <p className="text-sm text-gelo-300">{conteudo.exemplos[perfil.id]}</p>
              <p className="mt-auto w-fit rounded-full border border-borda bg-noite-950 px-3 py-1 text-xs text-gelo-300">
                {conteudo.etiqueta}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
