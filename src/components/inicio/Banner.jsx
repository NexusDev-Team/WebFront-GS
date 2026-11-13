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
import { ArrowDown, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import BotaoLed from '../ui/BotaoLed.jsx'
import { ENTRADA_CONTAINER as CONTAINER, ENTRADA_ITEM as ITEM } from '../ui/movimento.js'
import ImagemHero from './ImagemHero.jsx'

// Hero da página inicial (Design System v1.0, referência de composição): texto à esquerda e o
// aparelho à direita, com 90 a 100% da altura da janela. No desktop a imagem é o fundo de tela
// cheia, com um degradê da cor do fundo por cima da esquerda para o texto ler bem; no celular o
// aparelho aparece de fundo, no alto, junto do título, com um véu escuro por cima para o texto
// ler bem.
export default function Banner({ conteudo }) {
  return (
    <section
      aria-labelledby="titulo-banner"
      className="relative flex flex-col md:min-h-[calc(100svh-5rem)] overflow-hidden md:justify-center"
    >
      <div className="absolute inset-0">
        <ImagemHero
          src={conteudo.imagem.src}
          alt={conteudo.imagem.alt}
          className="object-[88%_top] md:object-[center_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-noite-950/80 via-noite-950/45 to-noite-950/85 md:bg-linear-to-r md:from-noite-950 md:via-noite-950/55 md:to-transparent md:to-70%"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-noite-950 to-transparent md:h-32"
        />
      </div>

      <motion.div
        variants={CONTAINER}
        initial="hidden"
        animate="visivel"
        className="conteudo relative z-10 flex flex-col items-start gap-6 py-20 md:py-0"
      >
        <motion.p variants={ITEM} className="rotulo-tecnico flex w-full items-center gap-5 md:max-w-2xl">
          <span>{conteudo.rotulo}</span>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-linear-to-r from-gelo-azul/50 to-transparent sm:block" />
        </motion.p>

        <motion.h1
          id="titulo-banner"
          variants={ITEM}
          className="max-w-3xl text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.08] font-bold tracking-tight text-gelo-50"
        >
          {conteudo.tituloLinha1}
          <br />
          <span className="titulo-ciano">{conteudo.tituloLinha2}</span>
        </motion.h1>

        <motion.p variants={ITEM} className="max-w-xl text-lg text-gelo-100 sm:text-xl">
          {conteudo.texto}
        </motion.p>

        <motion.div variants={ITEM} className="flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-center">
          <BotaoLed as={Link} to={conteudo.acaoPrincipal.para} seta className="min-h-14! px-8!">
            {conteudo.acaoPrincipal.rotulo}
          </BotaoLed>
          <BotaoLed
            as={Link}
            to={conteudo.acaoSecundaria.para}
            variante="secundario"
            icone={<Play className="size-4 fill-current" />}
          >
            {conteudo.acaoSecundaria.rotulo}
          </BotaoLed>
        </motion.div>
      </motion.div>

      <a
        href="#problema"
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-6 left-1/2 z-10 hidden h-14 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-gelo-300/50 text-gelo-100 transition-colors duration-300 hover:border-ciano hover:text-ciano md:flex"
      >
        <ArrowDown aria-hidden="true" className="size-4 motion-safe:animate-bounce" />
      </a>
    </section>
  )
}
