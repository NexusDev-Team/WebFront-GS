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

// Cliente genérico da MockAPI (um por recurso) com um fetch falso: URLs, corpos e erros.
import { describe, expect, it, vi } from 'vitest'
import { ErroApi, criarCliente } from '../src/services/mockapi.js'

const BASE = 'https://exemplo.mockapi.io/api/v1'

// Resposta mínima no formato da Fetch API.
function resposta(status, corpo) {
  return { ok: status >= 200 && status < 300, status, json: async () => corpo }
}
function clienteCom(respostas, opcoes = {}) {
  const fetchFalso = vi.fn()
  for (const r of respostas) {
    if (r instanceof Error) fetchFalso.mockRejectedValueOnce(r)
    else fetchFalso.mockResolvedValueOnce(r)
  }
  return { api: criarCliente(BASE, 'instalacoes', { fetchImpl: fetchFalso, ...opcoes }), fetchFalso }
}

describe('listar', () => {
  it('pede o recurso certo, sem filtros nem ordem', async () => {
    const { api, fetchFalso } = clienteCom([resposta(200, [{ id: '1' }])])
    expect(await api.listar()).toEqual([{ id: '1' }])
    expect(fetchFalso).toHaveBeenCalledWith(`${BASE}/instalacoes`, expect.anything())
  })
  it('manda só os filtros preenchidos', async () => {
    const { api, fetchFalso } = clienteCom([resposta(200, []), resposta(200, [])])
    await api.listar({ localId: 'farmacia-mooca', apelido: '' })
    expect(fetchFalso.mock.calls[0][0]).toBe(`${BASE}/instalacoes?localId=farmacia-mooca`)
    await api.listar({ apelido: '' })
    expect(fetchFalso.mock.calls[1][0]).toBe(`${BASE}/instalacoes`)
  })
  it('ordena quando o cliente foi criado com ordem', async () => {
    const { api, fetchFalso } = clienteCom([resposta(200, [])], { ordem: { campo: 'instaladoEm', sentido: 'asc' } })
    await api.listar()
    expect(fetchFalso.mock.calls[0][0]).toBe(`${BASE}/instalacoes?sortBy=instaladoEm&order=asc`)
  })
  it('a MockAPI responde 404 quando não acha nada: vira lista vazia', async () => {
    const { api } = clienteCom([resposta(404, 'Not found')])
    expect(await api.listar()).toEqual([])
  })
  it('aceita a barra final na URL base', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(resposta(200, []))
    await criarCliente(`${BASE}/`, 'instalacoes', { fetchImpl: fetchFalso }).listar()
    expect(fetchFalso.mock.calls[0][0]).toBe(`${BASE}/instalacoes`)
  })
})

describe('criar, atualizar e excluir', () => {
  it('criar manda POST com o corpo em JSON e devolve o criado', async () => {
    const { api, fetchFalso } = clienteCom([resposta(201, { id: '9', localId: 'ubs-brasilandia' })])
    expect(await api.criar({ localId: 'ubs-brasilandia' })).toEqual({ id: '9', localId: 'ubs-brasilandia' })
    const [url, opcoes] = fetchFalso.mock.calls[0]
    expect(url).toBe(`${BASE}/instalacoes`)
    expect(opcoes.method).toBe('POST')
    expect(opcoes.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(opcoes.body)).toEqual({ localId: 'ubs-brasilandia' })
  })
  it('atualizar manda PUT para o id', async () => {
    const { api, fetchFalso } = clienteCom([resposta(200, { id: '9', apelido: 'Sala 3' })])
    expect(await api.atualizar('9', { apelido: 'Sala 3' })).toEqual({ id: '9', apelido: 'Sala 3' })
    const [url, opcoes] = fetchFalso.mock.calls[0]
    expect(url).toBe(`${BASE}/instalacoes/9`)
    expect(opcoes.method).toBe('PUT')
    expect(JSON.parse(opcoes.body)).toEqual({ apelido: 'Sala 3' })
  })
  it('excluir manda DELETE para o id', async () => {
    const { api, fetchFalso } = clienteCom([resposta(200, { id: '9' })])
    await api.excluir('9')
    const [url, opcoes] = fetchFalso.mock.calls[0]
    expect(url).toBe(`${BASE}/instalacoes/9`)
    expect(opcoes.method).toBe('DELETE')
  })
  it('cada cliente fala só com o seu recurso', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(resposta(200, []))
    await criarCliente(BASE, 'outro', { fetchImpl: fetchFalso }).listar()
    expect(fetchFalso.mock.calls[0][0]).toBe(`${BASE}/outro`)
  })
})

describe('erros normalizados', () => {
  it('sem URL configurada: erro claro e nenhuma chamada de rede', async () => {
    const fetchFalso = vi.fn()
    const api = criarCliente('', 'instalacoes', { fetchImpl: fetchFalso })
    for (const chamada of [() => api.listar(), () => api.criar({}), () => api.atualizar('1', {}), () => api.excluir('1')]) {
      await expect(chamada()).rejects.toMatchObject({
        name: 'ErroApi',
        status: 0,
        codigo: 'SEM_URL',
        message: 'A API do C-Shield não está configurada (VITE_MOCKAPI_URL).',
      })
    }
    expect(fetchFalso).not.toHaveBeenCalled()
  })
  it('falha de rede vira mensagem de conexão', async () => {
    const { api } = clienteCom([new TypeError('Failed to fetch')])
    await expect(api.listar()).rejects.toMatchObject({
      status: 0,
      codigo: 'REDE',
      message: 'Sem conexão com a API. Confira a internet e tente de novo.',
    })
  })
  it('HTTP de erro vira mensagem com o código', async () => {
    const { api } = clienteCom([resposta(500, { x: 1 }), resposta(404, 'Not found'), resposta(400, null)])
    await expect(api.criar({})).rejects.toMatchObject({ status: 500, codigo: 'HTTP', message: 'A API respondeu com erro (500).' })
    await expect(api.atualizar('1', {})).rejects.toMatchObject({ status: 404, message: 'A API respondeu com erro (404).' })
    await expect(api.excluir('1')).rejects.toMatchObject({ status: 400, message: 'A API respondeu com erro (400).' })
  })
  it('ErroApi é um Error com status', () => {
    const e = new ErroApi('oi', 418)
    expect(e).toBeInstanceOf(Error)
    expect(e.status).toBe(418)
    expect(e.name).toBe('ErroApi')
    expect(e.codigo).toBe('HTTP')
  })
  it('ErroApi guarda o código informado', () => {
    expect(new ErroApi('x', 0, 'SEM_URL').codigo).toBe('SEM_URL')
  })
})
