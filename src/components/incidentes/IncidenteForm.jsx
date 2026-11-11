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

// Formulário de incidente (W32, W33). Modo "novo": todos os campos. Modo "editar": só a
// situação e a ação tomada. Rótulo sempre visível; o erro aparece junto do campo, ligado a ele
// por aria-describedby; ao falhar, o foco vai para o primeiro campo com erro.
import { useRef, useState } from 'react'
import {
  MOTIVOS_BLOQUEIO,
  ROTULOS,
  STATUS,
  TIPOS,
  novoIncidenteManual,
  validarEdicao,
  validarIncidente,
} from '../../domain/incidentes.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import ErroMensagem from '../ui/ErroMensagem.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import { agoraParaInput } from './formato.js'

const CONTROLE =
  'min-h-11 w-full rounded-lg border bg-noite-900 px-3 py-2 text-gelo-50 aria-[invalid=true]:border-ataque border-borda'

// Rótulo + controle + mensagem de erro ligados entre si.
function Campo({ id, rotulo, erro, dica, children }) {
  const ids = [dica ? `${id}-dica` : null, erro ? `${id}-erro` : null].filter(Boolean).join(' ')
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-gelo-50">
        {rotulo}
      </label>
      {children({ id, 'aria-invalid': erro ? 'true' : 'false', 'aria-describedby': ids || undefined, className: CONTROLE })}
      {dica ? (
        <p id={`${id}-dica`} className="text-sm text-gelo-300">
          {dica}
        </p>
      ) : null}
      {erro ? (
        <p id={`${id}-erro`} className="text-sm text-gelo-50">
          <span aria-hidden="true" className="mr-1 font-mono text-ataque">
            [erro]
          </span>
          {erro}
        </p>
      ) : null}
    </div>
  )
}

function valoresIniciais(modo, inicial) {
  if (modo === 'editar') return { status: inicial.status, acaoTomada: inicial.acaoTomada ?? '' }
  return {
    localNome: '',
    bairro: '',
    tipo: 'CALOR',
    motivo: 'SETPOINT_INVALIDO',
    inicio: agoraParaInput(),
    tempoReacaoS: '',
    exposicao: '',
    status: 'ABERTO',
    acaoTomada: '',
  }
}

export default function IncidenteForm({ modo = 'novo', inicial, aoSalvar, aoCancelar }) {
  const editar = modo === 'editar'
  const [valores, setValores] = useState(() => valoresIniciais(modo, inicial))
  const [erros, setErros] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [erroApi, setErroApi] = useState('')
  const formRef = useRef(null)

  const muda = (campo) => (e) => setValores((v) => ({ ...v, [campo]: e.target.value }))
  const campo = (id, rotulo, extra) => ({ id: `inc-${id}`, rotulo, erro: erros[id], ...extra })

  async function enviar(e) {
    e.preventDefault()
    const achados = editar ? validarEdicao(valores) : validarIncidente(valores)
    setErros(achados)
    setErroApi('')
    if (Object.keys(achados).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setSalvando(true)
    try {
      await aoSalvar(
        editar
          ? { status: valores.status, acaoTomada: valores.acaoTomada.trim() }
          : novoIncidenteManual(valores),
      )
    } catch (erro) {
      setErroApi(erro.message)
      setSalvando(false)
    }
  }

  return (
    <PainelVidro as="section" className="p-4 sm:p-6" aria-label={editar ? 'Editar incidente' : 'Novo incidente'}>
      <h2 className="mb-4 text-2xl font-bold text-gelo-50">
        {editar ? `Editar incidente de ${inicial.localNome}` : 'Novo incidente'}
      </h2>
      <form ref={formRef} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
        {!editar && (
          <>
            <Campo {...campo('localNome', 'Nome do local')}>
              {(p) => <input {...p} type="text" value={valores.localNome} onChange={muda('localNome')} autoComplete="off" />}
            </Campo>
            <Campo {...campo('bairro', 'Bairro')}>
              {(p) => <input {...p} type="text" value={valores.bairro} onChange={muda('bairro')} autoComplete="off" />}
            </Campo>
            <Campo {...campo('tipo', 'Tipo de ataque')}>
              {(p) => (
                <select {...p} value={valores.tipo} onChange={muda('tipo')}>
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {ROTULOS.tipo[t]}
                    </option>
                  ))}
                </select>
              )}
            </Campo>
            <Campo {...campo('motivo', 'O que aconteceu')}>
              {(p) => (
                <select {...p} value={valores.motivo} onChange={muda('motivo')}>
                  {MOTIVOS_BLOQUEIO.map((m) => (
                    <option key={m} value={m}>
                      {ROTULOS.motivo[m]}
                    </option>
                  ))}
                </select>
              )}
            </Campo>
            <Campo {...campo('inicio', 'Quando começou')}>
              {(p) => <input {...p} type="datetime-local" value={valores.inicio} onChange={muda('inicio')} />}
            </Campo>
            <Campo {...campo('tempoReacaoS', 'Tempo para reagir (segundos)', { dica: 'Pode deixar em branco.' })}>
              {(p) => (
                <input {...p} type="text" inputMode="decimal" value={valores.tempoReacaoS} onChange={muda('tempoReacaoS')} />
              )}
            </Campo>
            <Campo {...campo('exposicao', 'Exposição (°C·min)', { dica: 'Quanto o lote ficou fora da faixa. Pode deixar em branco.' })}>
              {(p) => (
                <input {...p} type="text" inputMode="decimal" value={valores.exposicao} onChange={muda('exposicao')} />
              )}
            </Campo>
          </>
        )}

        <Campo {...campo('status', 'Situação')}>
          {(p) => (
            <select {...p} value={valores.status} onChange={muda('status')}>
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {ROTULOS.status[s]}
                </option>
              ))}
            </select>
          )}
        </Campo>
        <div className="sm:col-span-2">
          <Campo
            {...campo('acaoTomada', 'Ação tomada', {
              dica: 'Exemplo: lote de vacinas enviado para análise. Obrigatória para marcar como resolvido.',
            })}
          >
            {(p) => <textarea {...p} rows={3} value={valores.acaoTomada} onChange={muda('acaoTomada')} />}
          </Campo>
        </div>

        {erroApi ? (
          <div className="sm:col-span-2">
            <ErroMensagem mensagem={erroApi} />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <BotaoLed type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : editar ? 'Salvar alterações' : 'Registrar incidente'}
          </BotaoLed>
          <BotaoLed variante="fantasma" onClick={aoCancelar} disabled={salvando}>
            Cancelar
          </BotaoLed>
        </div>
      </form>
    </PainelVidro>
  )
}
