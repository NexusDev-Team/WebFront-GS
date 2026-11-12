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

import Pagina from '../components/ui/Pagina.jsx'

// Página 404: rota inexistente.
import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <Pagina as="section">
      <h1>Esta câmara não existe.</h1>
      <p>
        <Link to="/">Voltar ao início</Link>
      </p>
    </Pagina>
  )
}
