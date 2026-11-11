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
 * cidade.js — a cidade do emulador: 5 locais com câmaras frias, ataques e proteção.
 * Tudo é função pura: cada função devolve uma cidade nova e nunca muda a recebida, para servir
 * ao estado do React. O tempo é do jogo, não da vida real: 1 s real = 1 min simulado, então um
 * ataque, o bloqueio, a liberação e o "seguro" cabem em bem menos de 1 min reais.
 */
import { criarContexto } from './cshield.js'
import { PERFIS_EMULADOR } from './perfis.js'

// Os 5 locais (nomes genéricos). x e y são a posição no mapa SVG (viewBox 0 0 1000 600).
export const LOCAIS = [
  { id: 'ubs-vila-mariana', nome: 'UBS Vila Mariana', bairro: 'Vila Mariana', perfil: 'VACINA', x: 300, y: 390 },
  { id: 'ubs-brasilandia', nome: 'UBS Brasilândia', bairro: 'Brasilândia', perfil: 'VACINA', x: 250, y: 110 },
  { id: 'hemocentro-consolacao', nome: 'Hemocentro Consolação', bairro: 'Consolação', perfil: 'PLASMA', x: 490, y: 260 },
  { id: 'farmacia-mooca', nome: 'Farmácia Mooca', bairro: 'Mooca', perfil: 'INSULINA', x: 740, y: 310 },
  { id: 'mercado-liberdade', nome: 'Mercado Liberdade', bairro: 'Liberdade', perfil: 'CONGELADO', x: 570, y: 450 },
]

// Só esta unidade já nasce com o C-Shield instalado; as outras mostram o que acontece sem ele.
const ID_PROTEGIDO_INICIAL = 'ubs-vila-mariana'

// Perfil (faixa de temperatura) de um local pelo id.
export function perfilDoLocal(localId) {
  const def = LOCAIS.find((l) => l.id === localId)
  return PERFIS_EMULADOR[def.perfil]
}

function criarLocal(def) {
  return {
    protegido: def.id === ID_PROTEGIDO_INICIAL,
    temperatura: PERFIS_EMULADOR[def.perfil].tAlvo,
    ordem: 'NORMAL', // o que o atacante manda ao controlador: 'NORMAL' | 'CALOR' | 'FRIO'
    houveAtaque: false,
    inicioAtaqueSimMs: null,
    reacaoSimMs: null, // quanto o C-Shield levou para reagir ao ataque
    exposicao: 0,
    contexto: criarContexto(),
    decisao: null, // só os protegidos têm decisão
    refrigeracaoLigada: true,
    liberacaoPendente: false,
    liberacaoRecusada: false,
    historico: [],
  }
}

export function criarCidade() {
  return {
    relogioSimMs: 0,
    restoSimMs: 0, // fração de ciclo ainda não simulada
    locais: Object.fromEntries(LOCAIS.map((def) => [def.id, criarLocal(def)])),
    ataquesRecentes: [], // [{ localId, emRealMs }]
    coordenado: null, // null | { n, segundos }
  }
}

// Ataque coordenado (D8): a central percebe no próprio clique que 3 ou mais locais diferentes
// foram atacados dentro de 20 s reais.
const JANELA_COORDENADO_REAL_MS = 20000
const MIN_LOCAIS_COORDENADO = 3

// Atualiza a lista de ataques recentes e, se der 3 ou mais locais na janela, marca o coordenado.
// O aviso fica até recomeçar: não some quando a janela passa.
function registrarAtaque(cidade, localId, agoraRealMs) {
  const recentes = cidade.ataquesRecentes
    .filter((a) => a.localId !== localId && agoraRealMs - a.emRealMs <= JANELA_COORDENADO_REAL_MS)
    .concat({ localId, emRealMs: agoraRealMs })
  cidade.ataquesRecentes = recentes
  if (recentes.length >= MIN_LOCAIS_COORDENADO) {
    const maisAntigo = Math.min(...recentes.map((a) => a.emRealMs))
    cidade.coordenado = { n: recentes.length, segundos: Math.round((agoraRealMs - maisAntigo) / 1000) }
  }
}

// O atacante manda uma ordem ao controlador comercial do local. CALOR: setpoint perigosamente
// alto e refrigeração do controlador desligada. FRIO: setpoint baixo demais (W26b).
export function atacar(cidade, localId, tipo, agoraRealMs) {
  if (!cidade.locais[localId]) throw new Error(`Local desconhecido: ${localId}`)
  if (tipo !== 'CALOR' && tipo !== 'FRIO') throw new Error(`Tipo de ataque desconhecido: ${tipo}`)
  const nova = structuredClone(cidade)
  const local = nova.locais[localId]
  local.ordem = tipo
  local.houveAtaque = true
  local.inicioAtaqueSimMs = nova.relogioSimMs
  local.reacaoSimMs = null
  local.liberacaoPendente = false
  local.liberacaoRecusada = false
  registrarAtaque(nova, localId, agoraRealMs)
  return nova
}
