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

// A seção "E na sua cidade?" da página Notícias: depois de ver o que aconteceu na Europa, a pessoa
// cadastra uma câmara fria do bairro dela. É o CRUD em API externa do site: cadastrar, listar
// (com filtro por tipo), editar e excluir, com carregando, erro e lista vazia. A seção só
// desenha: os dados vêm do hook useCamaras.
import { useState } from 'react'
import { ROTULOS_TIPO, TIPOS } from '../../domain/camaras.js'
import { useCamaras } from '../../hooks/useCamaras.js'
import BotaoLed from '../ui/BotaoLed.jsx'
import Carregando from '../ui/Carregando.jsx'
import ErroMensagem from '../ui/ErroMensagem.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import TituloLed from '../ui/TituloLed.jsx'
import CartaoCamara from './CartaoCamara.jsx'
import FormCamara from './FormCamara.jsx'

export default function SecaoSuaCidade() {
  const { itens, carregando, erro, filtroTipo, setFiltroTipo, recarregar, cadastrar, editar, excluir } = useCamaras()
  const [cadastrando, setCadastrando] = useState(false)

  return (
    <section aria-labelledby="sua-cidade" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <TituloLed nivel={2}>
          <span id="sua-cidade">E na sua cidade?</span>
        </TituloLed>
        <p className="max-w-2xl text-gelo-300">
          Os mesmos equipamentos atacados na Europa existem aqui. Cadastre uma câmara fria do seu
          bairro: a padaria, a UBS, o hemocentro, o mercadinho. Quanto mais gente olhar para elas,
          mais cedo alguém percebe que algo esquentou.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <BotaoLed onClick={() => setCadastrando(true)} disabled={cadastrando}>
          + Cadastrar uma câmara
        </BotaoLed>
        <label className="flex flex-col gap-1 text-sm text-gelo-300">
          Mostrar só
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="min-h-11 rounded-lg border border-borda bg-noite-900 px-3 text-base text-gelo-50"
          >
            <option value="">Todas</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {ROTULOS_TIPO[t]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {cadastrando ? (
        <PainelVidro as="div" className="p-4">
          <h3 className="mb-3 text-lg font-semibold text-gelo-50">Nova câmara do bairro</h3>
          <FormCamara
            modo="novo"
            aoSalvar={async (form) => {
              await cadastrar(form)
              setCadastrando(false)
            }}
            aoCancelar={() => setCadastrando(false)}
          />
        </PainelVidro>
      ) : null}

      {carregando ? <Carregando texto="Buscando as câmaras..." /> : null}
      {!carregando && erro ? <ErroMensagem mensagem={erro.message} aoTentarDeNovo={recarregar} /> : null}

      {!carregando && !erro && itens.length === 0 ? (
        <p className="rounded-lg border border-borda bg-noite-900 p-4 text-gelo-50">
          {filtroTipo ? 'Nenhuma câmara desse tipo ainda.' : 'Nenhuma câmara cadastrada ainda. Seja a primeira pessoa a cadastrar a do seu bairro.'}
        </p>
      ) : null}

      {!carregando && !erro && itens.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Câmaras cadastradas">
          {itens.map((c) => (
            <CartaoCamara key={c.id} camara={c} aoEditar={editar} aoExcluir={excluir} />
          ))}
        </ul>
      ) : null}
    </section>
  )
}
