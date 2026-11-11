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
 * cidade-protecao.js — quem tem o C-Shield na cidade: instalar, remover e sincronizar com as
 * instalações cadastradas. Funções puras sobre a cidade de cidade.js (nunca mudam a recebida).
 */
import { criarContexto } from './cshield.js'
import { ID_PILOTO, LOCAIS } from './cidade.js'

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

// Põe a proteção da cidade de acordo com a lista de instalações cadastradas: instala quem está na
// lista e remove quem saiu. A unidade piloto sempre fica; ids desconhecidos são ignorados; um
// local bloqueado só sai depois de liberado (ver removerCShield).
export function sincronizarProtecao(cidade, idsInstalados) {
  let nova = cidade
  for (const def of LOCAIS) {
    const deveTer = def.id === ID_PILOTO || idsInstalados.includes(def.id)
    const tem = nova.locais[def.id].protegido
    if (deveTer && !tem) nova = instalarCShield(nova, def.id)
    else if (!deveTer && tem) nova = removerCShield(nova, def.id)
  }
  return nova
}

// Apelido temporário do botão antigo "Ativar C-Shield" (protege tudo). Sai quando o hook migrar.
export function ativarCShield(cidade) {
  return LOCAIS.reduce((c, def) => instalarCShield(c, def.id), cidade)
}
