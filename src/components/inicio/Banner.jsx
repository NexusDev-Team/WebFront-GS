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

import { useState } from 'react'
import { Link } from 'react-router-dom'
import BotaoLed from '../ui/BotaoLed.jsx'
import FlocoNeve from '../ui/FlocoNeve.jsx'
import Logo from '../ui/Logo.jsx'
import Rotulo from '../ui/Rotulo.jsx'
import TituloLed from '../ui/TituloLed.jsx'

// Máscara que funde as bordas da imagem com o fundo da página.
const MASCARA = 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 55%, transparent 100%)'

// Espaço reservado enquanto a imagem da câmara fria não existe: um cartão de vidro fosco com o
// escudo da logo e dois anéis de luz.
function ImagemReservada() {
  return (
    <div className="vidro-fosco relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-5 overflow-hidden">
      <div aria-hidden="true" className="absolute size-56 rounded-full border border-led-forte/20" />
      <div aria-hidden="true" className="absolute size-36 rounded-full border border-led-forte/30" />
      <Logo variante="escudo" className="relative h-24!" />
      <p className="relative text-sm text-gelo-300">C-Shield · junto da câmara fria</p>
    </div>
  )
}

// Banner da página inicial, como no mockup: o texto à esquerda e a câmara fria à direita, com uma
// luz azul atrás, uma malha hexagonal na borda e flocos de neve de enfeite. Se o arquivo da imagem
// não existir, mostra o espaço reservado.
export default function Banner({ conteudo }) {
  const [semImagem, setSemImagem] = useState(false)

  return (
    <section aria-labelledby="titulo-banner" className="relative overflow-hidden">
      <div aria-hidden="true" className="luz-azul absolute top-1/2 -right-32 size-[640px] -translate-y-1/2" />
      <div aria-hidden="true" className="malha-hex absolute inset-y-0 right-0 hidden w-1/2 sm:block" />
      <FlocoNeve className="absolute top-[58%] left-4 hidden size-12 text-led-forte/35 sm:block" />
      <FlocoNeve className="absolute right-8 bottom-[18%] hidden size-14 text-led-forte/30 lg:block" />

      <div className="relative mx-auto grid min-h-[min(80vh,720px)] max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <Rotulo className="text-base sm:text-lg">{conteudo.rotulo}</Rotulo>
          <TituloLed nivel={1} className="max-w-2xl leading-[1.05] text-balance lg:text-[3.25rem]">
            <span id="titulo-banner">{conteudo.titulo}</span>
          </TituloLed>
          <p className="max-w-lg text-lg text-gelo-300 sm:text-xl">{conteudo.texto}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <BotaoLed as={Link} to={conteudo.acaoPrincipal.para}>
              {conteudo.acaoPrincipal.rotulo}
            </BotaoLed>
            <BotaoLed as={Link} to={conteudo.acaoSecundaria.para} variante="fantasma">
              {conteudo.acaoSecundaria.rotulo}
            </BotaoLed>
          </div>
        </div>

        {semImagem ? (
          <ImagemReservada />
        ) : (
          <img
            src={conteudo.imagem.src}
            alt={conteudo.imagem.alt}
            loading="eager"
            fetchPriority="high"
            onError={() => setSemImagem(true)}
            className="aspect-[4/3] w-full object-cover"
            style={{ maskImage: MASCARA, WebkitMaskImage: MASCARA }}
          />
        )}
      </div>
    </section>
  )
}
