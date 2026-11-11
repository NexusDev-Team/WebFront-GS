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

/*
 * useInstalacoes — o CRUD das instalações do C-Shield (instalar, listar, editar, remover) com
 * carregamento e erro. Não faz fetch: usa o cliente de services/mockapi.js (ou outro passado,
 * nos testes). Escrever só muda a lista local depois de a API confirmar; se falhar, repassa o
 * erro para quem chamou mostrar junto do botão.
 */
import { useCallback, useEffect, useState } from 'react'
import { novaInstalacao } from '../domain/instalacoes.js'
import { instalacoesApi } from '../services/mockapi.js'

export function useInstalacoes(api = instalacoesApi) {
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [versao, setVersao] = useState(0) // sobe a cada "tentar de novo"

  useEffect(() => {
    let ativo = true // descarta a resposta de uma consulta que já ficou velha
    api
      .listar()
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
  }, [api, versao])

  const recarregar = useCallback(() => {
    setCarregando(true)
    setErro(null)
    setVersao((v) => v + 1)
  }, [])

  // form = { localId, apelido, observacao }; a data da instalação é a de agora.
  const instalar = useCallback(
    async (form) => {
      const novo = await api.criar(novaInstalacao(form, new Date().toISOString()))
      setItens((atual) => [...atual, novo])
      return novo
    },
    [api],
  )

  const editar = useCallback(
    async (id, dados) => {
      const novo = await api.atualizar(id, dados)
      setItens((atual) => atual.map((i) => (i.id === id ? novo : i)))
      return novo
    },
    [api],
  )

  const remover = useCallback(
    async (id) => {
      await api.excluir(id)
      setItens((atual) => atual.filter((i) => i.id !== id))
    },
    [api],
  )

  return { itens, carregando, erro, recarregar, instalar, editar, remover }
}
