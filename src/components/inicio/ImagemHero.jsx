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
import { useState } from 'react'

// Imagem de fundo do hero: o render do aparelho com névoa, binários e circuito já na própria arte.
// Respira devagar (escala de 1 a 1,03 em 14 s; o MotionConfig do App desliga com movimento reduzido).
// Se o arquivo falhar, some e sobra o fundo escuro da página. Decorativa para o leitor de tela:
// o texto do hero já diz o que é o produto (alt vazio quando só enfeita; aqui descrevemos o aparelho).
export default function ImagemHero({ src, alt, className = '' }) {
  const [falhou, setFalhou] = useState(false)
  if (falhou) return null

  return (
    <motion.img
      src={src}
      alt={alt}
      loading="eager"
      fetchPriority="high"
      onError={() => setFalhou(true)}
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: [1, 1.03, 1] }}
      transition={{
        opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 14, ease: 'easeInOut', repeat: Infinity },
      }}
      className={`size-full object-cover ${className}`}
    />
  )
}
