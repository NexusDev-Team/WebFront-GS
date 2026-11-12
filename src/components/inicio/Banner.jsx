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
import Logo from '../ui/Logo.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import Rotulo from '../ui/Rotulo.jsx'
import TituloLed from '../ui/TituloLed.jsx'

// Máscara que funde as bordas da imagem com o fundo da página.
const MASCARA = 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 55%, transparent 100%)'

// Banner da página inicial: título, frase, duas ações e a imagem da câmara fria. Se o arquivo
// da imagem não existir, mostra um espaço reservado com o escudo da logo.
export default function Banner({ conteudo }) {
  const [semImagem, setSemImagem] = useState(false)

  return (
    <section
      aria-labelledby="titulo-banner"
      className="mx-auto grid min-h-[min(80vh,720px)] max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2"
    >
      <div className="flex flex-col items-start gap-6">
        <Rotulo>{conteudo.rotulo}</Rotulo>
        <TituloLed nivel={1} className="max-w-xl">
          <span id="titulo-banner">{conteudo.titulo}</span>
        </TituloLed>
        <p className="max-w-lg text-lg text-gelo-300">{conteudo.texto}</p>
        <div className="flex flex-wrap gap-3">
          <BotaoLed as={Link} to={conteudo.acaoPrincipal.para}>
            {conteudo.acaoPrincipal.rotulo}
          </BotaoLed>
          <BotaoLed as={Link} to={conteudo.acaoSecundaria.para} variante="fantasma">
            {conteudo.acaoSecundaria.rotulo}
          </BotaoLed>
        </div>
      </div>

      {semImagem ? (
        <PainelVidro className="flex aspect-[4/3] items-center justify-center">
          <Logo variante="escudo" className="!h-28 opacity-80" />
        </PainelVidro>
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
    </section>
  )
}
