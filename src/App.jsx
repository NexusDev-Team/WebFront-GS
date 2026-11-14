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

// Rotas do site. Navbar e rodapé vêm de components/ui.
import { MotionConfig } from 'framer-motion'
import { Navigate, Route, Routes } from 'react-router-dom'
import FundoAtmosfera from './components/ui/FundoAtmosfera.jsx'
import Navbar from './components/ui/Navbar.jsx'
import Footer from './components/ui/Footer.jsx'
import Home from './pages/Home.jsx'
import Emulador from './pages/Emulador.jsx'
import Problema from './pages/Problema.jsx'
import NexusDev from './pages/NexusDev.jsx'
import ComoFunciona from './pages/ComoFunciona.jsx'
import NaoEncontrada from './pages/NaoEncontrada.jsx'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <FundoAtmosfera />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-led-forte focus:px-4 focus:py-2 focus:text-noite-950"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/emulador" element={<Emulador />} />
          <Route path="/problema" element={<Problema />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/nexus-dev" element={<NexusDev />} />
          {/* Rotas antigas: o dispositivo real virou seção do emulador; notícias e incidentes viraram a página Problema. */}
          <Route path="/simulador-real" element={<Navigate to="/emulador#dispositivo-real" replace />} />
          <Route path="/noticias" element={<Navigate to="/problema" replace />} />
          <Route path="/incidentes" element={<Navigate to="/problema" replace />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
      <Footer />
    </MotionConfig>
  )
}
