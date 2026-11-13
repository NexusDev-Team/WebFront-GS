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
import BotaoLed from '../ui/BotaoLed.jsx'
import Revelar from '../ui/Revelar.jsx'
import CartaoNoticia from './CartaoNoticia.jsx'

// "Outras matérias do caso": mostra só as primeiras (3, por padrão) para a página não ficar
// carregada, e um botão "Ver todas as matérias (N)" revela o resto. O botão diz o estado com
// aria-expanded e controla a lista pelo id.
export default function ListaMaterias({ noticias, visiveis = 3 }) {
  const [aberta, setAberta] = useState(false)
  const mostradas = aberta ? noticias : noticias.slice(0, visiveis)
  const temMais = noticias.length > visiveis

  return (
    <div className="flex flex-col gap-8">
      <ul id="lista-materias" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mostradas.map((n, indice) => (
          <li key={n.id}>
            <Revelar atraso={(indice % 3) * 0.08} className="h-full">
              <CartaoNoticia noticia={n} />
            </Revelar>
          </li>
        ))}
      </ul>
      {temMais ? (
        <div>
          <BotaoLed
            variante="fantasma"
            aria-expanded={aberta}
            aria-controls="lista-materias"
            onClick={() => setAberta((valor) => !valor)}
          >
            {aberta ? 'Mostrar menos' : `Ver todas as matérias (${noticias.length})`}
          </BotaoLed>
        </div>
      ) : null}
    </div>
  )
}
