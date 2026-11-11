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

// Um incidente na lista (W30, W33, W34). Mostra os dados, o status em cor E texto (W49) e as
// ações. Excluir pede confirmação na própria linha, sem confirm() (W34).
import { useEffect, useRef, useState } from 'react'
import { ROTULOS } from '../../domain/incidentes.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import { formatarDataHora, formatarNumero } from './formato.js'

const COR_STATUS = {
  ABERTO: 'var(--color-atencao)',
  EM_ANALISE: 'var(--color-led-forte)',
  RESOLVIDO: 'var(--color-ok)',
}

function Dado({ rotulo, children }) {
  return (
    <div>
      <dt className="font-mono text-xs text-gelo-300">{rotulo}</dt>
      <dd className="text-gelo-50">{children}</dd>
    </div>
  )
}

export default function IncidenteItem({ incidente: i, aoEditar, aoExcluir }) {
  const [confirmando, setConfirmando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')
  const cancelar = useRef(null)
  const excluir = useRef(null)

  // Ao abrir a confirmação o foco vai para "Cancelar" (o caminho seguro).
  useEffect(() => {
    if (confirmando) cancelar.current?.focus()
  }, [confirmando])

  // Fechar devolve o foco ao botão "Excluir", que volta a existir no próximo quadro.
  function fecharConfirmacao() {
    setConfirmando(false)
    setErro('')
    requestAnimationFrame(() => excluir.current?.focus())
  }

  async function confirmarExclusao() {
    setExcluindo(true)
    setErro('')
    try {
      await aoExcluir(i.id)
    } catch (e) {
      setErro(e.message)
      setExcluindo(false)
    }
  }

  return (
    <PainelVidro as="li" className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-gelo-50">{i.localNome}</h3>
          <p className="text-gelo-300">{i.bairro}</p>
        </div>
        <span
          className="inline-flex items-center gap-2 rounded-full border bg-noite-900 px-3 py-1 font-mono text-sm text-gelo-50"
          style={{ borderColor: COR_STATUS[i.status] }}
        >
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full"
            style={{ backgroundColor: COR_STATUS[i.status] }}
          />
          {ROTULOS.status[i.status] ?? i.status}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
        <Dado rotulo="Ataque">{ROTULOS.tipo[i.tipo] ?? i.tipo}</Dado>
        <Dado rotulo="O que aconteceu">{ROTULOS.motivo[i.motivo] ?? i.motivo}</Dado>
        <Dado rotulo="Quando">{formatarDataHora(i.inicio)}</Dado>
        <Dado rotulo="Tempo para reagir">{Number(i.tempoReacaoS ?? 0)} s</Dado>
        <Dado rotulo="Exposição (°C·min)">
          <span className="font-mono">{formatarNumero(i.exposicao)}</span>
        </Dado>
        <Dado rotulo="Registrado por">{ROTULOS.origem[i.origem] ?? i.origem}</Dado>
      </dl>

      {i.acaoTomada ? (
        <p className="text-gelo-50">
          <span className="font-mono text-sm text-gelo-300">Ação tomada: </span>
          {i.acaoTomada}
        </p>
      ) : null}

      {confirmando ? (
        <div
          role="group"
          aria-label="Confirmar exclusão"
          className="flex flex-col gap-3 rounded-lg border border-ataque bg-noite-900 p-3"
        >
          <p className="text-gelo-50">Excluir este incidente? Não dá para desfazer.</p>
          {erro ? (
            <p role="alert" className="text-gelo-50">
              <span aria-hidden="true" className="mr-2 font-mono text-ataque">
                [erro]
              </span>
              {erro}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <BotaoLed variante="ataque" onClick={confirmarExclusao} disabled={excluindo}>
              {excluindo ? 'Excluindo...' : 'Sim, excluir'}
            </BotaoLed>
            <BotaoLed ref={cancelar} variante="fantasma" onClick={fecharConfirmacao} disabled={excluindo}>
              Cancelar
            </BotaoLed>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <BotaoLed variante="fantasma" ariaLabel={`Editar incidente de ${i.localNome}`} onClick={() => aoEditar(i)}>
            Editar
          </BotaoLed>
          <BotaoLed
            ref={excluir}
            variante="fantasma"
            ariaLabel={`Excluir incidente de ${i.localNome}`}
            onClick={() => setConfirmando(true)}
          >
            Excluir
          </BotaoLed>
        </div>
      )}
    </PainelVidro>
  )
}
