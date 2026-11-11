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

// Formulário curto de uma instalação: apelido e observação (os dois opcionais). Serve para
// instalar o C-Shield num local e para editar a instalação. A faixa segura não aparece aqui:
// ela é gravada no aparelho e não muda pela rede.
import { useRef, useState } from 'react'
import { novaInstalacao, validarEdicaoInstalacao, validarInstalacao } from '../../domain/instalacoes.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import CampoFormulario from '../ui/CampoFormulario.jsx'
import ErroMensagem from '../ui/ErroMensagem.jsx'

// modo: 'instalar' | 'editar'. aoSalvar recebe { localId, apelido, observacao } (já validado) e
// devolve uma promessa; se falhar, a mensagem aparece aqui e o formulário continua aberto.
export default function FormInstalacao({ modo, localId, inicial, idsJaInstalados = [], aoSalvar, aoCancelar }) {
  const [valores, setValores] = useState({ apelido: inicial?.apelido ?? '', observacao: inicial?.observacao ?? '' })
  const [erros, setErros] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [erroApi, setErroApi] = useState('')
  const formRef = useRef(null)
  const editar = modo === 'editar'

  const muda = (campo) => (e) => setValores((v) => ({ ...v, [campo]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    const form = { localId, ...valores }
    const achados = editar ? validarEdicaoInstalacao(form) : validarInstalacao(form, idsJaInstalados)
    setErros(achados)
    setErroApi('')
    if (Object.keys(achados).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setSalvando(true)
    try {
      const { apelido, observacao } = novaInstalacao(form, '')
      await aoSalvar({ localId, apelido, observacao })
    } catch (erro) {
      setErroApi(erro.message)
      setSalvando(false)
    }
  }

  const id = (campo) => `inst-${localId}-${campo}`

  return (
    <form ref={formRef} onSubmit={enviar} noValidate className="mt-3 grid gap-3 sm:grid-cols-2">
      <CampoFormulario id={id('apelido')} rotulo="Apelido (opcional)" erro={erros.apelido} dica="Exemplo: Sala 2.">
        {(p) => <input {...p} type="text" value={valores.apelido} onChange={muda('apelido')} autoComplete="off" />}
      </CampoFormulario>
      <CampoFormulario id={id('observacao')} rotulo="Observação (opcional)" erro={erros.observacao}>
        {(p) => <input {...p} type="text" value={valores.observacao} onChange={muda('observacao')} autoComplete="off" />}
      </CampoFormulario>
      {erros.localId ? (
        <p role="alert" className="text-gelo-50 sm:col-span-2">
          <span aria-hidden="true" className="mr-1 font-mono text-ataque">
            [erro]
          </span>
          {erros.localId}
        </p>
      ) : null}
      {erroApi ? (
        <div className="sm:col-span-2">
          <ErroMensagem mensagem={erroApi} />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <BotaoLed type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : editar ? 'Salvar alterações' : 'Instalar C-Shield'}
        </BotaoLed>
        <BotaoLed variante="fantasma" onClick={aoCancelar} disabled={salvando}>
          Cancelar
        </BotaoLed>
      </div>
    </form>
  )
}
