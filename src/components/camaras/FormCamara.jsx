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

// Formulário da câmara do bairro: serve para cadastrar e para editar. Rótulo sempre visível, erro
// junto do campo (ligado por aria-describedby) e, ao falhar, o foco vai para o primeiro campo com
// erro. Se a API falhar, a mensagem aparece aqui e o formulário continua aberto.
import { useRef, useState } from 'react'
import { ROTULOS_TIPO, TIPOS, validarCamara } from '../../domain/camaras.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import CampoFormulario from '../ui/CampoFormulario.jsx'
import ErroMensagem from '../ui/ErroMensagem.jsx'

const VAZIO = { nome: '', bairro: '', tipo: 'VACINA', observacao: '' }

// modo: 'novo' | 'editar'. aoSalvar recebe os campos já validados e devolve uma promessa.
export default function FormCamara({ modo = 'novo', inicial, aoSalvar, aoCancelar }) {
  const editar = modo === 'editar'
  const [valores, setValores] = useState(() => (editar ? { ...VAZIO, ...inicial } : VAZIO))
  const [erros, setErros] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [erroApi, setErroApi] = useState('')
  const formRef = useRef(null)

  const muda = (campo) => (e) => setValores((v) => ({ ...v, [campo]: e.target.value }))
  const id = (campo) => `camara-${editar ? inicial.id : 'nova'}-${campo}`

  async function enviar(e) {
    e.preventDefault()
    const achados = validarCamara(valores)
    setErros(achados)
    setErroApi('')
    if (Object.keys(achados).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setSalvando(true)
    try {
      await aoSalvar(valores)
    } catch (erro) {
      setErroApi(erro.message)
      setSalvando(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={enviar} noValidate className="grid gap-3 sm:grid-cols-2">
      <CampoFormulario id={id('nome')} rotulo="Nome do lugar" erro={erros.nome} dica="Exemplo: Padaria da Dona Rosa.">
        {(p) => <input {...p} type="text" value={valores.nome} onChange={muda('nome')} autoComplete="off" />}
      </CampoFormulario>
      <CampoFormulario id={id('bairro')} rotulo="Bairro" erro={erros.bairro}>
        {(p) => <input {...p} type="text" value={valores.bairro} onChange={muda('bairro')} autoComplete="off" />}
      </CampoFormulario>
      <CampoFormulario id={id('tipo')} rotulo="O que a câmara guarda" erro={erros.tipo}>
        {(p) => (
          <select {...p} value={valores.tipo} onChange={muda('tipo')}>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {ROTULOS_TIPO[t]}
              </option>
            ))}
          </select>
        )}
      </CampoFormulario>
      <CampoFormulario id={id('observacao')} rotulo="Observação (opcional)" erro={erros.observacao}>
        {(p) => <input {...p} type="text" value={valores.observacao} onChange={muda('observacao')} autoComplete="off" />}
      </CampoFormulario>
      {erroApi ? (
        <div className="sm:col-span-2">
          <ErroMensagem mensagem={erroApi} />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <BotaoLed type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : editar ? 'Salvar alterações' : 'Cadastrar câmara'}
        </BotaoLed>
        <BotaoLed variante="fantasma" onClick={aoCancelar} disabled={salvando}>
          Cancelar
        </BotaoLed>
      </div>
    </form>
  )
}
