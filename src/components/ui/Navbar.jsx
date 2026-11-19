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
import { Menu, X } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import BotaoLed from './BotaoLed.jsx'
import Logo from './Logo.jsx'

// Navegação principal (Design System v1.0): barra de 80 px, quatro links em texto e o botão em
// pílula "Simular ataque →". No celular vira um botão de menu (aria-expanded). NavLink já marca a
// rota atual com aria-current="page"; a rota atual leva ciano e um sublinhado de 2 px.
const LINKS = [
  { para: '/', rotulo: 'Home' },
  { para: '/como-funciona', rotulo: 'Como funciona' },
  { para: '/problema', rotulo: 'Problema' },
  { para: '/nexus-dev', rotulo: 'Nexus Dev' },
]

function classeDoLink({ isActive }) {
  const base =
    'relative flex min-h-11 w-fit items-center px-1 text-base font-medium transition-colors duration-300 ease-suave after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:rounded-full after:transition-colors'
  return isActive
    ? `${base} text-ciano after:bg-ciano`
    : `${base} text-gelo-100 after:bg-transparent hover:text-gelo-50 hover:after:bg-gelo-azul/40`
}

export default function Navbar() {
  const [aberto, setAberto] = useState(false)
  const fechar = () => setAberto(false)

  return (
    <header className="sticky top-0 z-40 bg-noite-950/90">
      {/* O header se dissolve no conteúdo: um degradê desce da cor do fundo até transparente, sem linha seca. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full h-10 bg-linear-to-b from-noite-950/90 to-transparent"
      />
      <nav
        aria-label="Principal"
        className="conteudo flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2"
      >
        <Link to="/" aria-label="C-Shield, página inicial" className="rounded-xl" onClick={fechar}>
          <Logo variante="compacta" />
        </Link>

        <button
          type="button"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setAberto((valor) => !valor)}
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-borda text-gelo-50 transition-colors duration-300 hover:border-gelo-azul md:hidden"
        >
          {aberto ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>

        <ul
          id="menu-principal"
          className={`${aberto ? 'flex' : 'hidden'} w-full flex-col gap-1 pb-3 md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:pb-0`}
        >
          {LINKS.map((link) => (
            <li key={link.para}>
              <NavLink to={link.para} end className={classeDoLink} onClick={fechar}>
                {link.rotulo}
              </NavLink>
            </li>
          ))}
          <li className="mt-2 md:mt-0">
            <BotaoLed as={NavLink} to="/emulador" seta className="min-h-11! px-5! text-sm!" onClick={fechar}>
              Simular ataque
            </BotaoLed>
          </li>
        </ul>
      </nav>
    </header>
  )
}
