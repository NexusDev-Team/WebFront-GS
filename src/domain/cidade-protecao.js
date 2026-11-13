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
 * cidade-protecao.js — quem tem o C-Shield na cidade: ativar (instalar) e desativar (remover) por
 * local, só dentro do jogo (sem API). Funções puras sobre a cidade de cidade.js (nunca mudam a recebida).
 */
import { criarContexto } from './cshield.js'
import { ID_PILOTO } from './cidade.js'

// Instala o C-Shield num local. A política não muda (W26): é a mesma de sempre, gravada no
// dispositivo. Se o local já estava sob ataque, passa a ser protegido dali em diante: a exposição
// acumulada continua valendo e a reação conta a partir da instalação.
function instalarNoLocal(nova, local) {
  if (local.protegido) return
  local.protegido = true
  local.contexto = criarContexto()
  local.contexto.exposicao = local.exposicao
  local.decisao = null
  if (local.ordem !== 'NORMAL') {
    local.inicioAtaqueSimMs = nova.relogioSimMs
    local.reacaoSimMs = null
  }
}

export function instalarCShield(cidade, localId) {
  if (!cidade.locais[localId]) throw new Error(`Local desconhecido: ${localId}`)
  const nova = structuredClone(cidade)
  instalarNoLocal(nova, nova.locais[localId])
  return nova
}

// Tira o C-Shield de um local. Não faz nada se for a unidade piloto, se não estiver instalado ou
// se estiver com o ataque bloqueado: o bloqueio só termina presencialmente, então primeiro é
// preciso liberar. Sem proteção, o local volta a sofrer o ataque sem ninguém reagir.
export function removerCShield(cidade, localId) {
  const atual = cidade.locais[localId]
  if (!atual || localId === ID_PILOTO || !atual.protegido || atual.contexto.bloqueado) return cidade
  const nova = structuredClone(cidade)
  const local = nova.locais[localId]
  local.protegido = false
  local.decisao = null
  local.contexto = criarContexto()
  local.liberacaoPendente = false
  local.liberacaoRecusada = false
  return nova
}

// O bloqueio só termina presencialmente (botão segurado por 3 s): com o ataque bloqueado, não dá
// para desativar o C-Shield do local. Primeiro é preciso liberar.
export function podeDesativar(local) {
  return !local.contexto.bloqueado
}

export function motivoNaoDesativar(local) {
  return podeDesativar(local) ? '' : 'Libere o bloqueio no local primeiro.'
}
