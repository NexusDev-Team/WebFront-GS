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

// As ações de defesa, na parte de baixo do card da simulação: o que dá para fazer no local
// escolhido para protegê-lo. ATIVAR ou DESATIVAR o C-Shield nele (é o CRUD das instalações: ativar
// cria o registro na API, desativar exclui, e dá para editar o apelido). Desativar pede
// confirmação na própria página e fica desligado enquanto o ataque estiver bloqueado, porque o
// bloqueio só termina presencialmente. A unidade piloto é fixa. Use key={def.id} para zerar ao
// trocar de local.
import { useState } from 'react'
import { motivoNaoRemover } from '../../domain/instalacoes.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import Carregando from '../ui/Carregando.jsx'
import ConfirmacaoInline from '../ui/ConfirmacaoInline.jsx'
import ErroMensagem from '../ui/ErroMensagem.jsx'
import Logo from '../ui/Logo.jsx'
import FormInstalacao from './FormInstalacao.jsx'

export default function AcoesDefesa({ def, local, instalacao, piloto, instalacoes }) {
  const { carregando, erro, recarregar, instalar, editar, remover } = instalacoes
  const [modo, setModo] = useState(null) // null | 'editar' | 'desativar'
  const [ocupado, setOcupado] = useState(false)
  const [erroAcao, setErroAcao] = useState('')

  const motivoBloqueado = motivoNaoRemover(local)

  async function ativar() {
    setOcupado(true)
    setErroAcao('')
    try {
      await instalar({ localId: def.id, apelido: '', observacao: '' })
    } catch (e) {
      setErroAcao(e.message)
    } finally {
      setOcupado(false)
    }
  }

  async function desativar() {
    setOcupado(true)
    setErroAcao('')
    try {
      await remover(instalacao.id)
      setModo(null)
    } catch (e) {
      setErroAcao(e.message)
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center" role="group" aria-label="Defesa do local escolhido">
      <p className="flex flex-wrap items-center justify-center gap-2 text-gelo-50" aria-live="polite">
        <Logo variante="escudo" />
        <span className="font-titulo text-lg font-semibold">Defesa</span>
        <span className="text-gelo-300">
          · <strong className="text-gelo-50">{def.nome}</strong>: {local.protegido ? 'com C-Shield' : 'sem C-Shield'}
          {instalacao?.apelido ? ` (${instalacao.apelido})` : ''}
        </span>
      </p>

      {carregando ? <Carregando texto="Buscando as instalações..." /> : null}
      {!carregando && erro ? (
        <div className="flex w-full max-w-xl flex-col gap-1 text-left">
          <ErroMensagem mensagem={erro.message} aoTentarDeNovo={recarregar} />
          <p className="text-sm text-gelo-300">Sem a lista, só a unidade piloto fica protegida. O jogo continua.</p>
        </div>
      ) : null}

      {piloto ? (
        <p className="text-gelo-300">Unidade piloto: o C-Shield já vem instalado aqui e não pode ser desativado.</p>
      ) : null}

      {!piloto && !instalacao ? (
        <BotaoLed onClick={ativar} disabled={ocupado || carregando}>
          {ocupado ? 'Ativando...' : 'Ativar C-Shield nesse local'}
        </BotaoLed>
      ) : null}

      {!piloto && instalacao && modo === null ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <BotaoLed variante="ataque" onClick={() => setModo('desativar')} disabled={Boolean(motivoBloqueado)}>
            Desativar C-Shield nesse local
          </BotaoLed>
          <BotaoLed variante="fantasma" onClick={() => setModo('editar')}>
            Editar apelido
          </BotaoLed>
          {motivoBloqueado ? <span className="text-sm text-gelo-300">{motivoBloqueado}</span> : null}
        </div>
      ) : null}

      {modo === 'desativar' ? (
        <div className="w-full max-w-xl text-left">
          <ConfirmacaoInline
            mensagem="Desativar o C-Shield nesse local? O ataque volta a fazer efeito, sem ninguém para barrar."
            rotuloConfirmar="Sim, desativar"
            ocupado={ocupado}
            erro={erroAcao}
            aoConfirmar={desativar}
            aoCancelar={() => {
              setModo(null)
              setErroAcao('')
            }}
          />
        </div>
      ) : null}

      {modo === 'editar' ? (
        <div className="w-full max-w-xl text-left">
          <FormInstalacao
            modo="editar"
            localId={def.id}
            inicial={instalacao}
            aoSalvar={async (dados) => {
              await editar(instalacao.id, { apelido: dados.apelido, observacao: dados.observacao })
              setModo(null)
            }}
            aoCancelar={() => setModo(null)}
          />
        </div>
      ) : null}

      {modo === null && erroAcao ? (
        <div className="w-full max-w-xl text-left">
          <ErroMensagem mensagem={erroAcao} />
        </div>
      ) : null}
    </div>
  )
}
