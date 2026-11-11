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

// Serviço da MockAPI com um fetch falso: URLs, corpos e erros normalizados.
import { describe, expect, it, vi } from 'vitest'
import { ErroApi, criarClienteIncidentes } from '../src/services/mockapi.js'

const BASE = 'https://exemplo.mockapi.io/api/v1'

// Resposta mínima no formato da Fetch API.
function resposta(status, corpo) {
  return { ok: status >= 200 && status < 300, status, json: async () => corpo }
}
function clienteCom(respostas) {
  const fetchFalso = vi.fn()
  for (const r of respostas) {
    if (r instanceof Error) fetchFalso.mockRejectedValueOnce(r)
    else fetchFalso.mockResolvedValueOnce(r)
  }
  return { api: criarClienteIncidentes(BASE, fetchFalso), fetchFalso }
}

describe('listar', () => {
  it('pede a lista mais recente primeiro, sem filtros', async () => {
    const { api, fetchFalso } = clienteCom([resposta(200, [{ id: '1' }])])
    expect(await api.listar()).toEqual([{ id: '1' }])
    expect(fetchFalso).toHaveBeenCalledWith(`${BASE}/incidentes?sortBy=inicio&order=desc`, expect.anything())
  })
  it('manda só os filtros preenchidos', async () => {
    const { api, fetchFalso } = clienteCom([resposta(200, []), resposta(200, [])])
    await api.listar({ status: 'ABERTO', tipo: 'CALOR' })
    expect(fetchFalso.mock.calls[0][0]).toBe(`${BASE}/incidentes?status=ABERTO&tipo=CALOR&sortBy=inicio&order=desc`)
    await api.listar({ status: '', tipo: 'FRIO' })
    expect(fetchFalso.mock.calls[1][0]).toBe(`${BASE}/incidentes?tipo=FRIO&sortBy=inicio&order=desc`)
  })
  it('a MockAPI responde 404 quando o filtro não acha nada: vira lista vazia', async () => {
    const { api } = clienteCom([resposta(404, 'Not found')])
    expect(await api.listar({ status: 'RESOLVIDO' })).toEqual([])
  })
  it('aceita a barra final na URL base', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(resposta(200, []))
    await criarClienteIncidentes(`${BASE}/`, fetchFalso).listar()
    expect(fetchFalso.mock.calls[0][0]).toBe(`${BASE}/incidentes?sortBy=inicio&order=desc`)
  })
})

describe('criar, atualizar e excluir', () => {
  it('criar manda POST com o corpo em JSON e devolve o criado', async () => {
    const { api, fetchFalso } = clienteCom([resposta(201, { id: '9', localNome: 'A' })])
    expect(await api.criar({ localNome: 'A' })).toEqual({ id: '9', localNome: 'A' })
    const [url, opcoes] = fetchFalso.mock.calls[0]
    expect(url).toBe(`${BASE}/incidentes`)
    expect(opcoes.method).toBe('POST')
    expect(opcoes.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(opcoes.body)).toEqual({ localNome: 'A' })
  })
  it('atualizar manda PUT para o id', async () => {
    const { api, fetchFalso } = clienteCom([resposta(200, { id: '9', status: 'RESOLVIDO' })])
    expect(await api.atualizar('9', { status: 'RESOLVIDO' })).toEqual({ id: '9', status: 'RESOLVIDO' })
    const [url, opcoes] = fetchFalso.mock.calls[0]
    expect(url).toBe(`${BASE}/incidentes/9`)
    expect(opcoes.method).toBe('PUT')
    expect(JSON.parse(opcoes.body)).toEqual({ status: 'RESOLVIDO' })
  })
  it('excluir manda DELETE para o id', async () => {
    const { api, fetchFalso } = clienteCom([resposta(200, { id: '9' })])
    await api.excluir('9')
    const [url, opcoes] = fetchFalso.mock.calls[0]
    expect(url).toBe(`${BASE}/incidentes/9`)
    expect(opcoes.method).toBe('DELETE')
  })
})

describe('erros normalizados', () => {
  it('sem URL configurada: erro claro e nenhuma chamada de rede', async () => {
    const fetchFalso = vi.fn()
    const api = criarClienteIncidentes('', fetchFalso)
    for (const chamada of [() => api.listar(), () => api.criar({}), () => api.atualizar('1', {}), () => api.excluir('1')]) {
      await expect(chamada()).rejects.toMatchObject({
        name: 'ErroApi',
        status: 0,
        message: 'A API de incidentes não está configurada (VITE_MOCKAPI_URL).',
      })
    }
    expect(fetchFalso).not.toHaveBeenCalled()
  })
  it('falha de rede vira mensagem de conexão', async () => {
    const { api } = clienteCom([new TypeError('Failed to fetch')])
    await expect(api.listar()).rejects.toMatchObject({
      status: 0,
      message: 'Sem conexão com a API. Confira a internet e tente de novo.',
    })
  })
  it('HTTP de erro vira mensagem com o código', async () => {
    const { api } = clienteCom([resposta(500, { x: 1 }), resposta(404, 'Not found'), resposta(400, null)])
    await expect(api.criar({})).rejects.toMatchObject({ status: 500, message: 'A API respondeu com erro (500).' })
    await expect(api.atualizar('1', {})).rejects.toMatchObject({ status: 404, message: 'A API respondeu com erro (404).' })
    await expect(api.excluir('1')).rejects.toMatchObject({ status: 400, message: 'A API respondeu com erro (400).' })
  })
  it('ErroApi é um Error com status', () => {
    const e = new ErroApi('oi', 418)
    expect(e).toBeInstanceOf(Error)
    expect(e.status).toBe(418)
    expect(e.name).toBe('ErroApi')
  })
})
