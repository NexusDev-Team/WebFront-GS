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

// Uma linha do painel de instalações: um local da cidade e o que dá para fazer com ele.
//   piloto        fixo, não sai;
//   sem C-Shield  botão "Instalar C-Shield" (abre o formulário curto);
//   instalado     apelido, data, observação e os botões Editar e Remover.
// Remover pede confirmação na própria linha e fica desligado, com o motivo escrito, enquanto o
// ataque estiver bloqueado: o bloqueio só termina presencialmente.
import { useRef, useState } from 'react'
import { motivoNaoRemover } from '../../domain/instalacoes.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import ConfirmacaoInline from '../ui/ConfirmacaoInline.jsx'
import { formatarDataHora } from '../ui/formato.js'
import FormInstalacao from './FormInstalacao.jsx'

export default function LinhaInstalacao({
  def,
  local,
  instalacao,
  piloto,
  idsJaInstalados,
  aoInstalar,
  aoEditar,
  aoRemover,
}) {
  const [aberto, setAberto] = useState(null) // null | 'instalar' | 'editar' | 'remover'
  const [removendo, setRemovendo] = useState(false)
  const [erroRemover, setErroRemover] = useState('')
  const botaoRemover = useRef(null)
  const botaoInstalar = useRef(null)
  const botaoEditar = useRef(null)

  const motivoBloqueado = motivoNaoRemover(local)
  const nome = instalacao?.apelido ? `${def.nome} · ${instalacao.apelido}` : def.nome

  // Fecha o que estava aberto e devolve o foco ao botão de origem.
  function fechar(refOrigem) {
    setAberto(null)
    setErroRemover('')
    requestAnimationFrame(() => refOrigem.current?.focus())
  }

  async function confirmarRemocao() {
    setRemovendo(true)
    setErroRemover('')
    try {
      await aoRemover(instalacao.id)
    } catch (e) {
      setErroRemover(e.message)
      setRemovendo(false)
    }
  }

  return (
    <li className="flex flex-col gap-2 rounded-lg border border-borda bg-noite-900 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-gelo-50">{nome}</p>
          <p className="text-sm text-gelo-300">
            {def.bairro}
            {instalacao ? ` · instalado em ${formatarDataHora(instalacao.instaladoEm)}` : ''}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-2 rounded-full border bg-noite-950 px-3 py-1 font-mono text-sm text-gelo-50"
          style={{ borderColor: local.protegido ? 'var(--color-led-forte)' : 'var(--color-borda)' }}
        >
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full"
            style={{ backgroundColor: local.protegido ? 'var(--color-led-forte)' : 'var(--color-gelo-300)' }}
          />
          {local.protegido ? 'Protegido' : 'Sem C-Shield'}
        </span>
      </div>

      {instalacao?.observacao ? <p className="text-gelo-300">{instalacao.observacao}</p> : null}

      {piloto ? <p className="text-gelo-300">Instalação piloto, fixa: já vem com o C-Shield.</p> : null}

      {!piloto && !instalacao && aberto !== 'instalar' ? (
        <div>
          <BotaoLed ref={botaoInstalar} variante="fantasma" ariaLabel={`Instalar C-Shield em ${def.nome}`} onClick={() => setAberto('instalar')}>
            Instalar C-Shield
          </BotaoLed>
        </div>
      ) : null}

      {aberto === 'instalar' ? (
        <FormInstalacao
          modo="instalar"
          localId={def.id}
          idsJaInstalados={idsJaInstalados}
          aoSalvar={async (dados) => {
            await aoInstalar(dados)
            setAberto(null)
          }}
          aoCancelar={() => fechar(botaoInstalar)}
        />
      ) : null}

      {instalacao && aberto === null ? (
        <div className="flex flex-wrap items-center gap-2">
          <BotaoLed ref={botaoEditar} variante="fantasma" ariaLabel={`Editar instalação de ${def.nome}`} onClick={() => setAberto('editar')}>
            Editar
          </BotaoLed>
          <BotaoLed
            ref={botaoRemover}
            variante="fantasma"
            ariaLabel={`Remover C-Shield de ${def.nome}`}
            disabled={Boolean(motivoBloqueado)}
            aria-describedby={motivoBloqueado ? `${def.id}-motivo` : undefined}
            onClick={() => setAberto('remover')}
          >
            Remover
          </BotaoLed>
          {motivoBloqueado ? (
            <span id={`${def.id}-motivo`} className="text-sm text-gelo-300">
              {motivoBloqueado}
            </span>
          ) : null}
        </div>
      ) : null}

      {aberto === 'editar' ? (
        <FormInstalacao
          modo="editar"
          localId={def.id}
          inicial={instalacao}
          aoSalvar={async (dados) => {
            await aoEditar(instalacao.id, { apelido: dados.apelido, observacao: dados.observacao })
            setAberto(null)
          }}
          aoCancelar={() => fechar(botaoEditar)}
        />
      ) : null}

      {aberto === 'remover' ? (
        <ConfirmacaoInline
          mensagem="Remover o C-Shield deste local? O ataque volta a fazer efeito, sem ninguém para barrar."
          rotuloConfirmar="Sim, remover"
          ocupado={removendo}
          erro={erroRemover}
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => fechar(botaoRemover)}
        />
      ) : null}
    </li>
  )
}
