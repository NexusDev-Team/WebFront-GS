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

// Uma câmara do bairro na lista: nome, bairro, o que guarda e a observação. Editar abre o
// formulário no próprio cartão; excluir pede confirmação na própria página, sem confirm().
import { useState } from 'react'
import { ROTULOS_TIPO } from '../../domain/camaras.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import ConfirmacaoInline from '../ui/ConfirmacaoInline.jsx'
import { formatarDataHora } from '../ui/formato.js'
import PainelVidro from '../ui/PainelVidro.jsx'
import FormCamara from './FormCamara.jsx'

export default function CartaoCamara({ camara: c, aoEditar, aoExcluir }) {
  const [modo, setModo] = useState(null) // null | 'editar' | 'excluir'
  const [excluindo, setExcluindo] = useState(false)
  const [erroExcluir, setErroExcluir] = useState('')

  async function confirmarExclusao() {
    setExcluindo(true)
    setErroExcluir('')
    try {
      await aoExcluir(c.id)
    } catch (e) {
      setErroExcluir(e.message)
      setExcluindo(false)
    }
  }

  if (modo === 'editar') {
    return (
      <PainelVidro as="li" className="p-4">
        <FormCamara
          modo="editar"
          inicial={c}
          aoSalvar={async (form) => {
            await aoEditar(c.id, form)
            setModo(null)
          }}
          aoCancelar={() => setModo(null)}
        />
      </PainelVidro>
    )
  }

  return (
    <PainelVidro as="li" className="flex flex-col gap-2 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gelo-50">{c.nome}</h3>
          <p className="text-gelo-300">{c.bairro}</p>
        </div>
        <span className="rounded-full border border-borda bg-noite-900 px-3 py-1 font-mono text-sm text-gelo-50">
          {ROTULOS_TIPO[c.tipo] ?? c.tipo}
        </span>
      </div>
      {c.observacao ? <p className="text-gelo-50">{c.observacao}</p> : null}
      {c.cadastradoEm ? <p className="text-sm text-gelo-300">Cadastrada em {formatarDataHora(c.cadastradoEm)}</p> : null}

      {modo === 'excluir' ? (
        <ConfirmacaoInline
          mensagem="Excluir esta câmara do cadastro? Não dá para desfazer."
          ocupado={excluindo}
          erro={erroExcluir}
          aoConfirmar={confirmarExclusao}
          aoCancelar={() => {
            setModo(null)
            setErroExcluir('')
          }}
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          <BotaoLed variante="fantasma" ariaLabel={`Editar ${c.nome}`} onClick={() => setModo('editar')}>
            Editar
          </BotaoLed>
          <BotaoLed variante="fantasma" ariaLabel={`Excluir ${c.nome}`} onClick={() => setModo('excluir')}>
            Excluir
          </BotaoLed>
        </div>
      )}
    </PainelVidro>
  )
}
