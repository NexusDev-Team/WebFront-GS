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

// Página Incidentes (W30 a W34): o registro de bloqueios, com as quatro operações do CRUD,
// filtros e os estados de carregando, erro e lista vazia. A página só desenha: os dados vêm do
// hook useIncidentes, que fala com a API.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import FiltrosIncidentes from '../components/incidentes/FiltrosIncidentes.jsx'
import IncidenteForm from '../components/incidentes/IncidenteForm.jsx'
import IncidenteItem from '../components/incidentes/IncidenteItem.jsx'
import BotaoLed from '../components/ui/BotaoLed.jsx'
import Carregando from '../components/ui/Carregando.jsx'
import ErroMensagem from '../components/ui/ErroMensagem.jsx'
import PromptTerminal from '../components/ui/PromptTerminal.jsx'
import TituloLed from '../components/ui/TituloLed.jsx'
import { useIncidentes } from '../hooks/useIncidentes.js'

export default function Incidentes() {
  const { itens, carregando, erro, filtros, setFiltros, recarregar, criar, atualizar, excluir } = useIncidentes()
  // null = nada aberto; 'novo' = formulário de criação; { editar: incidente } = edição.
  const [aberto, setAberto] = useState(null)
  const comFiltro = Boolean(filtros.status || filtros.tipo)

  async function salvarNovo(dados) {
    await criar(dados)
    setAberto(null)
  }
  async function salvarEdicao(id, dados) {
    await atualizar(id, dados)
    setAberto(null)
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <PromptTerminal>cshield --incidentes</PromptTerminal>
        <TituloLed nivel={1}>Incidentes</TituloLed>
        <p className="max-w-2xl text-gelo-300">
          Cada vez que o C-Shield barra um ataque, um incidente é registrado aqui. Você também pode
          registrar um à mão, acompanhar a análise e anotar o que foi feito.
        </p>
        <div>
          <BotaoLed onClick={() => setAberto('novo')} disabled={aberto !== null}>
            + Novo incidente
          </BotaoLed>
        </div>
      </header>

      {aberto === 'novo' ? <IncidenteForm modo="novo" aoSalvar={salvarNovo} aoCancelar={() => setAberto(null)} /> : null}

      <FiltrosIncidentes filtros={filtros} aoMudar={setFiltros} />

      {carregando ? <Carregando texto="Buscando incidentes..." /> : null}
      {!carregando && erro ? <ErroMensagem mensagem={erro.message} aoTentarDeNovo={recarregar} /> : null}

      {!carregando && !erro && itens.length === 0 ? (
        <p className="rounded-lg border border-borda bg-noite-900 p-4 text-gelo-50">
          {comFiltro ? (
            'Nenhum incidente com esses filtros. Tente outra combinação.'
          ) : (
            <>
              Nenhum incidente por aqui. Que tal{' '}
              <Link to="/emulador" className="text-led-forte underline underline-offset-4">
                atacar uma cidade no emulador
              </Link>
              ?
            </>
          )}
        </p>
      ) : null}

      {!carregando && !erro && itens.length > 0 ? (
        <ul className="flex flex-col gap-4" aria-label="Lista de incidentes">
          {itens.map((i) =>
            aberto?.editar?.id === i.id ? (
              <li key={i.id}>
                <IncidenteForm
                  modo="editar"
                  inicial={i}
                  aoSalvar={(dados) => salvarEdicao(i.id, dados)}
                  aoCancelar={() => setAberto(null)}
                />
              </li>
            ) : (
              <IncidenteItem key={i.id} incidente={i} aoEditar={(inc) => setAberto({ editar: inc })} aoExcluir={excluir} />
            ),
          )}
        </ul>
      ) : null}
    </section>
  )
}
