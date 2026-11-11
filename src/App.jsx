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

// Rotas do site. Navbar e rodapé vêm de components/ui.
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/ui/Navbar.jsx'
import Footer from './components/ui/Footer.jsx'
import Inicio from './pages/Inicio.jsx'
import Emulador from './pages/Emulador.jsx'
import Noticias from './pages/Noticias.jsx'
import NexusDev from './pages/NexusDev.jsx'
import ComoFunciona from './pages/ComoFunciona.jsx'
import NaoEncontrada from './pages/NaoEncontrada.jsx'

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-led-forte focus:px-4 focus:py-2 focus:text-noite-950"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-10 outline-none">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/emulador" element={<Emulador />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/nexus-dev" element={<NexusDev />} />
          {/* Rotas antigas: o dispositivo real virou seção do emulador e os incidentes viraram notícias. */}
          <Route path="/simulador-real" element={<Navigate to="/emulador#dispositivo-real" replace />} />
          <Route path="/incidentes" element={<Navigate to="/noticias" replace />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
