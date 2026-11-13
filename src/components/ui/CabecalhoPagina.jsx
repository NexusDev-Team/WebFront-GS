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

import { motion } from 'framer-motion'
import FundoCyber from './FundoCyber.jsx'
import { ENTRADA_CONTAINER, ENTRADA_ITEM } from './movimento.js'

// Impede a quebra de linha no hífen do nome ("C-" / "Shield"): o nome vai num trecho sem quebra.
function semQuebraNoNome(texto) {
  return texto.split('C-Shield').flatMap((parte, i) =>
    i === 0 ? [parte] : [<span key={i} className="whitespace-nowrap">C-Shield</span>, parte],
  )
}

// Cabeçalho das páginas internas, no estilo do hero da inicial (sem imagem): rótulo técnico com
// fio degradê, título grande (a 2ª linha, `destaque`, em ciano), subtítulo e ações opcionais
// (`children`), com entrada escalonada. `id` é o id do h1 e liga a seção a ele.
// `variante="ataque"` (só no emulador, durante um ataque) deixa o título vermelho com falha de
// energia; vermelho é cor de ataque real, então o destaque ciano some nesse caso.
export default function CabecalhoPagina({
  id = 'titulo-pagina',
  rotulo,
  titulo,
  destaque,
  subtitulo,
  variante = 'repouso',
  fundo = true,
  className = '',
  children,
}) {
  const ataque = variante === 'ataque'
  return (
    <section
      aria-labelledby={id}
      className={`relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 ${className}`}
    >
      {fundo ? <FundoCyber /> : null}
      {/* O mesmo degradê do fim do banner: o fundo some aos poucos, sem uma linha de corte. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-noite-950 to-transparent md:h-32" />
      <motion.div
        variants={ENTRADA_CONTAINER}
        initial="hidden"
        animate="visivel"
        className="conteudo relative flex flex-col items-start gap-6"
      >
        <motion.p variants={ENTRADA_ITEM} className="rotulo-tecnico flex w-full items-center gap-5 md:max-w-2xl">
          <span>{rotulo}</span>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-linear-to-r from-gelo-azul/50 to-transparent sm:block" />
        </motion.p>

        <motion.h1
          id={id}
          variants={ENTRADA_ITEM}
          className={`max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.08] font-bold tracking-tight text-balance ${
            ataque ? 'led-falha text-critico' : 'text-gelo-50'
          }`}
        >
          {semQuebraNoNome(titulo)}
          {destaque ? (
            <>
              <br />
              <span className={ataque ? '' : 'titulo-ciano'}>{semQuebraNoNome(destaque)}</span>
            </>
          ) : null}
        </motion.h1>

        {subtitulo ? (
          <motion.p variants={ENTRADA_ITEM} className="max-w-2xl text-lg text-gelo-100 sm:text-xl">
            {subtitulo}
          </motion.p>
        ) : null}

        {children ? (
          <motion.div variants={ENTRADA_ITEM} className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-2">
            {children}
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  )
}
