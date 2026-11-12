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
import { NOME_PRODUTO } from '../../domain/produto.js'
import Logo from './Logo.jsx'

// Rodapé em duas colunas: a marca com a frase do produto e os links do site e do projeto.
// O repositório do Edge e o Wokwi são a fonte de verdade do dispositivo.
const CLASSE_LINK =
  'inline-flex min-h-11 items-center text-gelo-300 underline-offset-4 transition-colors hover:text-gelo-50 hover:underline'

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
    <footer className="border-t border-borda bg-noite-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Logo variante="compacta" />
          <p className="max-w-sm text-gelo-300">Vê de longe. Só obedece de perto.</p>
          <p className="text-sm text-gelo-300">
            {NOME_PRODUTO} · Nexus Dev · GS 2026.2
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <nav aria-label="Páginas do site">
            <p className="mb-2 font-semibold text-gelo-50">Site</p>
            <ul>
              <li><Link to="/emulador" className={CLASSE_LINK}>Emulador</Link></li>
              <li><Link to="/noticias" className={CLASSE_LINK}>Notícias</Link></li>
              <li><Link to="/como-funciona" className={CLASSE_LINK}>Como funciona</Link></li>
              <li><Link to="/nexus-dev" className={CLASSE_LINK}>Nexus Dev</Link></li>
            </ul>
          </nav>
          <div>
            <p className="mb-2 font-semibold text-gelo-50">Projeto</p>
            <ul>
              <li><LinkExterno href={URL_REPOSITORIO_EDGE}>Repositório do Edge</LinkExterno></li>
              <li><LinkExterno href={URL_WOKWI}>Simulação no Wokwi</LinkExterno></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
