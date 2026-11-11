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

// Painel "Instalações do C-Shield" (o CRUD do emulador): lista os 5 locais e deixa instalar,
// editar e remover. Só desenha: os dados e as escritas vêm do hook useInstalacoes (que fala com
// a API), e a página liga o resultado ao mapa. Sem a API, o jogo segue só com a unidade piloto.
import { ID_PILOTO, LOCAIS } from '../../domain/cidade.js'
import { idsInstalados } from '../../domain/instalacoes.js'
import Carregando from '../ui/Carregando.jsx'
import ErroMensagem from '../ui/ErroMensagem.jsx'
import PainelVidro from '../ui/PainelVidro.jsx'
import TituloLed from '../ui/TituloLed.jsx'
import LinhaInstalacao from './LinhaInstalacao.jsx'

export default function PainelInstalacoes({ cidade, instalacoes }) {
  const { itens, carregando, erro, recarregar, instalar, editar, remover } = instalacoes
  const ids = idsInstalados(itens)

  return (
    <PainelVidro as="section" aria-labelledby="titulo-instalacoes" className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-col gap-1">
        <TituloLed nivel={2}>
          <span id="titulo-instalacoes">Instalações do C-Shield</span>
        </TituloLed>
        <p className="text-gelo-300">
          Só os locais com C-Shield barram o ataque. Instale, edite ou remova por aqui. A faixa
          segura de cada local vem gravada no aparelho e não muda pela rede.
        </p>
      </div>

      {carregando ? <Carregando texto="Buscando as instalações..." /> : null}
      {!carregando && erro ? (
        <div className="flex flex-col gap-2">
          <ErroMensagem mensagem={erro.message} aoTentarDeNovo={recarregar} />
          <p className="text-sm text-gelo-300">Sem a lista, só a unidade piloto fica protegida. O jogo continua.</p>
        </div>
      ) : null}

      <ul className="flex flex-col gap-3" aria-label="Locais e instalações">
        {LOCAIS.map((def) => (
          <LinhaInstalacao
            key={def.id}
            def={def}
            local={cidade.locais[def.id]}
            instalacao={itens.find((i) => i.localId === def.id)}
            piloto={def.id === ID_PILOTO}
            idsJaInstalados={ids}
            aoInstalar={instalar}
            aoEditar={editar}
            aoRemover={remover}
          />
        ))}
      </ul>
    </PainelVidro>
  )
}
