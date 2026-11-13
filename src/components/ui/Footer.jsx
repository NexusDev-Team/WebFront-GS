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

import { Link } from 'react-router-dom'
import { URL_REPOSITORIO_EDGE, URL_WOKWI } from '../../content/links.js'
import Logo from './Logo.jsx'

// Rodapé minimalista (Design System v1.0): a marca com a frase do produto, a navegação do site,
// os links do projeto e uma linha final com o contexto da entrega. O repositório do Edge e o
// Wokwi são a fonte de verdade do dispositivo.
const CLASSE_LINK =
  'inline-flex min-h-11 items-center text-gelo-300 underline-offset-4 transition-colors duration-300 hover:text-gelo-50 hover:underline'

function LinkExterno({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={CLASSE_LINK}>
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-borda/60 bg-noite-950">
      <div className="conteudo py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo variante="compacta" />
            <p className="max-w-sm text-gelo-300">Vê de longe. Só obedece de perto.</p>
          </div>
          <nav aria-label="Páginas do site">
            <p className="rotulo-tecnico mb-2">Site</p>
            <ul>
              <li><Link to="/emulador" className={CLASSE_LINK}>Emulador</Link></li>
              <li><Link to="/como-funciona" className={CLASSE_LINK}>Como funciona</Link></li>
              <li><Link to="/noticias" className={CLASSE_LINK}>Notícias</Link></li>
              <li><Link to="/nexus-dev" className={CLASSE_LINK}>Nexus Dev</Link></li>
            </ul>
          </nav>
          <div>
            <p className="rotulo-tecnico mb-2">Projeto</p>
            <ul>
              <li><LinkExterno href={URL_REPOSITORIO_EDGE}>Repositório do Edge</LinkExterno></li>
              <li><LinkExterno href={URL_WOKWI}>Simulação no Wokwi</LinkExterno></li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-borda/60 pt-6 font-mono text-xs tracking-wider text-gelo-300 uppercase">
          GS 2026.2 · FIAP · Nexus Dev
        </p>
      </div>
    </footer>
  )
}
