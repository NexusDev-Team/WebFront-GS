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

/*
 * useIncidentes — as quatro operações do CRUD de incidentes com carregamento e erro.
 * Não faz fetch: usa o cliente de services/mockapi.js (ou outro passado, nos testes).
 * Criar, atualizar e excluir mexem na lista local só depois de a API confirmar; se falharem,
 * repassam o erro para quem chamou (o formulário mostra junto ao botão).
 */
import { useCallback, useEffect, useState } from 'react'
import { casaComFiltros } from '../domain/incidentes.js'
import { incidentesApi } from '../services/mockapi.js'

const FILTROS_INICIAIS = { status: '', tipo: '' }

export function useIncidentes(api = incidentesApi) {
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS)
  const [versao, setVersao] = useState(0) // sobe a cada "tentar de novo"

  useEffect(() => {
    let ativo = true // descarta a resposta de uma consulta que já ficou velha
    api
      .listar(filtros)
      .then((lista) => {
        if (!ativo) return
        setItens(lista)
        setErro(null)
        setCarregando(false)
      })
      .catch((e) => {
        if (!ativo) return
        setErro(e)
        setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [api, filtros, versao])

  // Qualquer mudança de filtro ou nova tentativa volta ao estado "carregando".
  const mudarFiltros = useCallback((novos) => {
    setCarregando(true)
    setFiltros(novos)
  }, [])
  const recarregar = useCallback(() => {
    setCarregando(true)
    setErro(null)
    setVersao((v) => v + 1)
  }, [])

  const criar = useCallback(
    async (dados) => {
      const novo = await api.criar(dados)
      if (casaComFiltros(novo, filtros)) setItens((atual) => [novo, ...atual])
      return novo
    },
    [api, filtros],
  )

  const atualizar = useCallback(
    async (id, dados) => {
      const novo = await api.atualizar(id, dados)
      setItens((atual) =>
        atual.flatMap((i) => (i.id !== id ? [i] : casaComFiltros(novo, filtros) ? [novo] : [])),
      )
      return novo
    },
    [api, filtros],
  )

  const excluir = useCallback(
    async (id) => {
      await api.excluir(id)
      setItens((atual) => atual.filter((i) => i.id !== id))
    },
    [api],
  )

  return { itens, carregando, erro, filtros, setFiltros: mudarFiltros, recarregar, criar, atualizar, excluir }
}
