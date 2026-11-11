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

// Rotas do site. Navbar e rodapé provisórios até o T7.
import { NavLink, Route, Routes } from 'react-router-dom'
import { NOME_PRODUTO } from './domain/produto.js'
import Inicio from './pages/Inicio.jsx'
import Emulador from './pages/Emulador.jsx'
import SimuladorReal from './pages/SimuladorReal.jsx'
import Incidentes from './pages/Incidentes.jsx'
import ComoFunciona from './pages/ComoFunciona.jsx'
import NaoEncontrada from './pages/NaoEncontrada.jsx'

const LINKS = [
  { para: '/', rotulo: 'Início' },
  { para: '/emulador', rotulo: 'Emulador' },
  { para: '/simulador-real', rotulo: 'Dispositivo real' },
  { para: '/incidentes', rotulo: 'Incidentes' },
  { para: '/como-funciona', rotulo: 'Como funciona' },
]

export default function App() {
  return (
    <>
      <header>
        <nav aria-label="Principal">
          <strong>{NOME_PRODUTO}</strong>
          <ul>
            {LINKS.map((link) => (
              <li key={link.para}>
                <NavLink to={link.para} end>
                  {link.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/emulador" element={<Emulador />} />
          <Route path="/simulador-real" element={<SimuladorReal />} />
          <Route path="/incidentes" element={<Incidentes />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
      <footer>Vê de longe. Só obedece de perto. · Nexus Vision · GS 2026.2</footer>
    </>
  )
}
