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
 * mockapi.js — acesso à API externa (MockAPI) dos incidentes: listar com filtros, criar, atualizar
 * e excluir. É o único lugar do site que faz fetch para ela (componentes e hooks não fazem). A URL
 * base vem de VITE_MOCKAPI_URL. Todo erro vira um ErroApi com mensagem pronta para a tela.
 * Se a equipe trocar de API (D9), só este arquivo muda.
 */

// Erro com mensagem pronta para mostrar. status 0 = não chegou a falar com a API.
export class ErroApi extends Error {
  constructor(mensagem, status = 0) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

const MSG_SEM_URL = 'A API de incidentes não está configurada (VITE_MOCKAPI_URL).'
const MSG_REDE = 'Sem conexão com a API. Confira a internet e tente de novo.'

// Cliente da API de incidentes. `fetchImpl` existe para os testes trocarem o fetch por um falso.
export function criarClienteIncidentes(baseUrl, fetchImpl = (...args) => fetch(...args)) {
  const base = String(baseUrl ?? '').replace(/\/+$/, '')

  // Faz a chamada e normaliza os erros. Devolve a resposta HTTP já conferida (ok) ou a de 404
  // quando `aceita404` (a MockAPI responde 404 a um filtro sem resultado).
  async function chamar(caminho, opcoes = {}, { aceita404 = false } = {}) {
    if (!base) throw new ErroApi(MSG_SEM_URL)
    let resp
    try {
      resp = await fetchImpl(`${base}${caminho}`, {
        method: 'GET',
        ...opcoes,
        headers: { 'Content-Type': 'application/json', ...opcoes.headers },
      })
    } catch {
      throw new ErroApi(MSG_REDE)
    }
    if (!resp.ok && !(aceita404 && resp.status === 404)) {
      throw new ErroApi(`A API respondeu com erro (${resp.status}).`, resp.status)
    }
    return resp
  }

  const comCorpo = (method, dados) => ({ method, body: JSON.stringify(dados) })

  return {
    // Mais recentes primeiro; só manda os filtros preenchidos.
    async listar({ status, tipo } = {}) {
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (tipo) params.set('tipo', tipo)
      params.set('sortBy', 'inicio')
      params.set('order', 'desc')
      const resp = await chamar(`/incidentes?${params}`, {}, { aceita404: true })
      return resp.status === 404 ? [] : resp.json()
    },
    async criar(dados) {
      return (await chamar('/incidentes', comCorpo('POST', dados))).json()
    },
    async atualizar(id, dados) {
      return (await chamar(`/incidentes/${id}`, comCorpo('PUT', dados))).json()
    },
    async excluir(id) {
      return (await chamar(`/incidentes/${id}`, { method: 'DELETE' })).json()
    },
  }
}

// Cliente pronto para o site, com a URL do .env.
export const incidentesApi = criarClienteIncidentes(import.meta.env.VITE_MOCKAPI_URL)
