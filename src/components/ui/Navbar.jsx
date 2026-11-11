/*
 * C-Shield — site da GS 2026.2 "CitizenTech"
 * Front-end Design e Web Development · FIAP
 * Equipe Nexus Vision. Integrantes:
 *   Isac Nilton Fernandes de Oliveira — RM573282
 *   João Benedito de Oliveira Simplício — RM570206
 *   Leonardo Formigari — RM573291
 *   Luis Fernando — RM570959
 *   Nicolas Cinel — RM572940
 */

import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo.jsx'

// Navegação principal. No celular vira um botão de menu (aria-expanded). NavLink já marca
// a rota atual com aria-current="page" (W4).
const LINKS = [
  { para: '/', rotulo: 'Início' },
  { para: '/emulador', rotulo: 'Emulador' },
  { para: '/noticias', rotulo: 'Notícias' },
  { para: '/como-funciona', rotulo: 'Como funciona' },
  { para: '/nexus-dev', rotulo: 'Nexus Dev' },
]

function classeDoLink({ isActive }) {
  const base =
    'flex min-h-11 items-center rounded-lg px-3 font-titulo text-base font-semibold transition-colors duration-200'
  return isActive
    ? `${base} bg-noite-900 text-led-forte`
    : `${base} text-gelo-50 hover:text-led-forte`
}

export default function Navbar() {
  const [aberto, setAberto] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-borda bg-noite-950/95 backdrop-blur">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2"
      >
        <Link to="/" aria-label="C-Shield, página inicial" className="rounded-lg">
          <Logo variante="compacta" />
        </Link>

        <button
          type="button"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((valor) => !valor)}
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-borda px-3 font-mono text-sm text-gelo-50 md:hidden"
        >
          {aberto ? 'Fechar' : 'Menu'}
        </button>

        <ul
          id="menu-principal"
          className={`${aberto ? 'flex' : 'hidden'} w-full flex-col gap-1 md:flex md:w-auto md:flex-row`}
        >
          {LINKS.map((link) => (
            <li key={link.para}>
              <NavLink to={link.para} end className={classeDoLink} onClick={() => setAberto(false)}>
                {link.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
