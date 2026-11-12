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
 * mockapi.js — acesso à API externa (MockAPI): um cliente por recurso, com listar, criar,
 * atualizar e excluir. É o único lugar do site que faz fetch para ela (componentes e hooks não
 * fazem). A URL base vem de VITE_MOCKAPI_URL. Todo erro vira um ErroApi com mensagem pronta para
 * a tela. Se a equipe trocar de API (D9), só este arquivo muda.
 */

// Erro com mensagem pronta para mostrar. status 0 = não chegou a falar com a API.
export class ErroApi extends Error {
  constructor(mensagem, status = 0) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

const MSG_SEM_URL = 'A API do C-Shield não está configurada (VITE_MOCKAPI_URL).'
const MSG_REDE = 'Sem conexão com a API. Confira a internet e tente de novo.'

// Cliente de um recurso da API (por exemplo, 'instalacoes').
//   opcoes.fetchImpl  troca o fetch por um falso nos testes;
//   opcoes.ordem      { campo, sentido } para listar já ordenado.
export function criarCliente(baseUrl, recurso, { fetchImpl = (...args) => fetch(...args), ordem = null } = {}) {
  const base = String(baseUrl ?? '').replace(/\/+$/, '')

  // Faz a chamada e normaliza os erros. Devolve a resposta HTTP já conferida (ok) ou a de 404
  // quando `aceita404` (a MockAPI responde 404 a uma busca sem resultado).
  async function chamar(caminho, opcoes = {}, { aceita404 = false } = {}) {
    if (!base) throw new ErroApi(MSG_SEM_URL)
    let resp
    try {
      resp = await fetchImpl(`${base}/${recurso}${caminho}`, {
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
    // Só manda os filtros preenchidos; ordena se o cliente foi criado com ordem.
    async listar(filtros = {}) {
      const params = new URLSearchParams()
      for (const [campo, valor] of Object.entries(filtros)) if (valor) params.set(campo, valor)
      if (ordem) {
        params.set('sortBy', ordem.campo)
        params.set('order', ordem.sentido)
      }
      const consulta = params.toString()
      const resp = await chamar(consulta ? `?${consulta}` : '', {}, { aceita404: true })
      return resp.status === 404 ? [] : resp.json()
    },
    async criar(dados) {
      return (await chamar('', comCorpo('POST', dados))).json()
    },
    async atualizar(id, dados) {
      return (await chamar(`/${id}`, comCorpo('PUT', dados))).json()
    },
    async excluir(id) {
      return (await chamar(`/${id}`, { method: 'DELETE' })).json()
    },
  }
}

const URL_BASE = import.meta.env.VITE_MOCKAPI_URL

// As câmaras do bairro cadastradas pela pessoa: da mais recente para a mais antiga.
export const camarasApi = criarCliente(URL_BASE, 'camaras', {
  ordem: { campo: 'cadastradoEm', sentido: 'desc' },
})
