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
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo.jsx'

// Navegação principal. No celular vira um botão de menu (aria-expanded). NavLink já marca
// a rota atual com aria-current="page" (W4). O emulador é o botão de destaque, sem link repetido.
const LINKS = [
  { para: '/', rotulo: 'Início' },
  { para: '/noticias', rotulo: 'Notícias' },
  { para: '/como-funciona', rotulo: 'Como funciona' },
  { para: '/nexus-dev', rotulo: 'Nexus Dev' },
]

function classeDoLink({ isActive }) {
  const base = 'flex min-h-11 items-center rounded-xl px-3 text-base font-medium transition-colors duration-200'
  return isActive ? `${base} text-gelo-50 bg-noite-900` : `${base} text-gelo-300 hover:text-gelo-50`
}

const CLASSE_CTA =
  'flex min-h-11 items-center justify-center rounded-xl bg-led-forte px-5 text-base font-semibold text-noite-950 transition hover:brightness-110'

export default function Navbar() {
  const [aberto, setAberto] = useState(false)
  const fechar = () => setAberto(false)

  return (
    <header className="sticky top-0 z-40 border-b border-borda bg-noite-950/80 backdrop-blur-md">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2"
      >
        <Link to="/" aria-label="C-Shield, página inicial" className="rounded-xl" onClick={fechar}>
          <Logo variante="compacta" />
        </Link>

        <button
          type="button"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((valor) => !valor)}
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl border border-borda px-4 text-sm font-medium text-gelo-50 md:hidden"
        >
          {aberto ? 'Fechar' : 'Menu'}
        </button>

        <ul
          id="menu-principal"
          className={`${aberto ? 'flex' : 'hidden'} w-full flex-col gap-1 pb-2 md:flex md:w-auto md:flex-row md:items-center md:pb-0`}
        >
          {LINKS.map((link) => (
            <li key={link.para}>
              <NavLink to={link.para} end className={classeDoLink} onClick={fechar}>
                {link.rotulo}
              </NavLink>
            </li>
          ))}
          <li className="mt-1 md:mt-0 md:ml-2">
            <NavLink to="/emulador" className={CLASSE_CTA} onClick={fechar}>
              Simular ataque
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
