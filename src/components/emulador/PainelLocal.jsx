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

// O painel do local escolhido, logo abaixo do mapa: mostra se ele tem o C-Shield e deixa ATIVAR
// ou DESATIVAR o C-Shield nesse local (é o CRUD das instalações: ativar cria o registro na API,
// desativar exclui, e dá para editar o apelido). Desativar pede confirmação na própria página e
// fica desligado enquanto o ataque estiver bloqueado, porque o bloqueio só termina
// presencialmente. A unidade piloto é fixa. Use key={def.id} para zerar o painel ao trocar de local.
import { useState } from 'react'
import { motivoNaoRemover } from '../../domain/instalacoes.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import Carregando from '../ui/Carregando.jsx'
import ConfirmacaoInline from '../ui/ConfirmacaoInline.jsx'
import ErroMensagem from '../ui/ErroMensagem.jsx'
import { formatarDataHora } from '../ui/formato.js'
import PainelVidro from '../ui/PainelVidro.jsx'
import TituloLed from '../ui/TituloLed.jsx'
import FormInstalacao from './FormInstalacao.jsx'

export default function PainelLocal({ def, local, instalacao, piloto, instalacoes }) {
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
    <PainelVidro as="section" aria-labelledby="titulo-local" className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-col gap-1">
        <TituloLed nivel={2} variante={local.protegido ? 'assumiu' : 'repouso'}>
          <span id="titulo-local">{def.nome}</span>
        </TituloLed>
        <p className="text-gelo-50" aria-live="polite">
          {local.protegido ? 'Este local tem o C-Shield.' : 'Este local não tem o C-Shield.'}
          {instalacao?.apelido ? ` Apelido: ${instalacao.apelido}.` : ''}
        </p>
        {instalacao ? (
          <p className="text-sm text-gelo-300">
            Ativado em {formatarDataHora(instalacao.instaladoEm)}
            {instalacao.observacao ? ` · ${instalacao.observacao}` : ''}
          </p>
        ) : null}
      </div>

      {carregando ? <Carregando texto="Buscando as instalações..." /> : null}
      {!carregando && erro ? (
        <div className="flex flex-col gap-2">
          <ErroMensagem mensagem={erro.message} aoTentarDeNovo={recarregar} />
          <p className="text-sm text-gelo-300">Sem a lista, só a unidade piloto fica protegida. O jogo continua.</p>
        </div>
      ) : null}

      {piloto ? (
        <p className="rounded-lg border border-borda bg-noite-900 p-3 text-gelo-300">
          Unidade piloto: o C-Shield já vem instalado aqui e não pode ser desativado.
        </p>
      ) : null}

      {!piloto && !instalacao ? (
        <div>
          <BotaoLed onClick={ativar} disabled={ocupado || carregando}>
            {ocupado ? 'Ativando...' : 'Ativar C-Shield nesse local'}
          </BotaoLed>
        </div>
      ) : null}

      {!piloto && instalacao && modo === null ? (
        <div className="flex flex-wrap items-center gap-3">
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
      ) : null}

      {modo === 'editar' ? (
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
      ) : null}

      {modo === null && erroAcao ? <ErroMensagem mensagem={erroAcao} /> : null}
    </PainelVidro>
  )
}
