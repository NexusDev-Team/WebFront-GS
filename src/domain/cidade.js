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
 * cidade.js — a cidade do emulador: 5 locais com câmaras frias, ataques e proteção.
 * Tudo é função pura: cada função devolve uma cidade nova e nunca muda a recebida, para servir
 * ao estado do React. O tempo é do jogo, não da vida real: 1 s real = 1 min simulado, então um
 * ataque, o bloqueio, a liberação e o "seguro" cabem em bem menos de 1 min reais.
 */
import {
  EMULADOR_MINUTOS_POR_SEGUNDO,
  EMULADOR_TRAVA_MS_REAL,
  PERIODO_LEITURA_MS,
  SETPOINT_DEMO_ATAQUE,
} from './config.js'
import { avaliar, criarContexto } from './cshield.js'
import { ventoinhaRefrigeracao } from './cshield-saida.js'
import { alvoTermico, passoTermico } from './fisica.js'
import { PERFIS_EMULADOR } from './perfis.js'

// Os 5 locais (nomes genéricos). x e y são a posição no mapa SVG (viewBox 0 0 1000 600).
export const LOCAIS = [
  { id: 'ubs-vila-mariana', nome: 'UBS Vila Mariana', bairro: 'Vila Mariana', perfil: 'VACINA', x: 300, y: 380 },
  { id: 'ubs-brasilandia', nome: 'UBS Brasilândia', bairro: 'Brasilândia', perfil: 'VACINA', x: 140, y: 170 },
  { id: 'hemocentro-consolacao', nome: 'Hemocentro Consolação', bairro: 'Consolação', perfil: 'PLASMA', x: 800, y: 150 },
  { id: 'farmacia-mooca', nome: 'Farmácia Mooca', bairro: 'Mooca', perfil: 'INSULINA', x: 860, y: 300 },
  { id: 'mercado-liberdade', nome: 'Mercado Liberdade', bairro: 'Liberdade', perfil: 'CONGELADO', x: 640, y: 410 },
]

// A unidade piloto: já nasce com o C-Shield e nunca sai. As outras mostram o que acontece sem ele
// até o jogador instalar (instalações cadastradas na API).
export const ID_PILOTO = 'ubs-vila-mariana'

// Perfil (faixa de temperatura) de um local pelo id.
export function perfilDoLocal(localId) {
  const def = LOCAIS.find((l) => l.id === localId)
  return PERFIS_EMULADOR[def.perfil]
}

function criarLocal(def) {
  return {
    protegido: def.id === ID_PILOTO,
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

// ---------------------------------------------------------------------------
// Passo do tempo
// ---------------------------------------------------------------------------

// Tempo do jogo: cada ms real vale 60 ms simulados (1 s real = 1 min simulado).
export const MS_SIM_POR_MS_REAL = EMULADOR_MINUTOS_POR_SEGUNDO * 60
// A trava mínima do emulador é de 10 s reais (D6), ou seja, 10 min simulados.
export const TRAVA_SIM_MS = EMULADOR_TRAVA_MS_REAL * MS_SIM_POR_MS_REAL
// Um ponto do histórico a cada 10 s simulados; guarda os últimos 120 (cerca de 20 min simulados).
const HISTORICO_INTERVALO_SIM_MS = 10000
const HISTORICO_MAX_PONTOS = 120

// Setpoint que o controlador comercial está mandando, conforme a ordem do atacante.
// Calor: 45 °C (ou tMax + 30 nos congelados). Frio: tMin − 12. Normal: o alvo do perfil.
export function setpointDaOrdem(perfil, ordem) {
  if (ordem === 'CALOR') return perfil.tMax < 0 ? perfil.tMax + 30 : SETPOINT_DEMO_ATAQUE
  if (ordem === 'FRIO') return perfil.tMin - 12
  return perfil.tAlvo
}

// Um ciclo de 2 s simulados de um local (muda o local recebido, que já é uma cópia).
function cicloLocal(local, perfil, tSimMs) {
  const dtMin = PERIODO_LEITURA_MS / 60000
  const chaveEmNormal = local.ordem !== 'CALOR' // o ataque de calor desliga a refrigeração
  let aquecedorLigado
  let ventoinhaEmergencia = false

  if (local.protegido) {
    const leitura = {
      valida: true,
      temperatura: local.temperatura,
      umidade: 80,
      luzPct: 10, // porta fechada
      temSetpoint: true,
      setpoint: setpointDaOrdem(perfil, local.ordem),
      degelo: false,
      horaValida: true,
      hora: 2,
      liberacao: local.liberacaoPendente,
    }
    const { decisao, contexto } = avaliar(leitura, local.contexto, tSimMs, { perfil, travaMs: TRAVA_SIM_MS })
    // A ventoinha do controlador usa o bloqueio de ANTES deste ciclo: a ordem do atacante já a
    // desligou quando o C-Shield percebeu; durante o bloqueio ela só pode voltar a ligar.
    local.refrigeracaoLigada = ventoinhaRefrigeracao(local.refrigeracaoLigada, local.contexto.bloqueado, chaveEmNormal)
    if (decisao.novoBloqueio && local.reacaoSimMs === null && local.inicioAtaqueSimMs !== null) {
      local.reacaoSimMs = tSimMs - local.inicioAtaqueSimMs
    }
    local.contexto = contexto
    local.decisao = decisao
    local.exposicao = contexto.exposicao
    local.liberacaoPendente = false
    // Calor: o aquecedor aquece enquanto não for cortado. Frio: o C-Shield libera o aquecedor.
    aquecedorLigado = local.ordem === 'CALOR' ? !decisao.cortaAquecedor : local.ordem === 'FRIO' && decisao.bloqueado
    ventoinhaEmergencia = decisao.ligaVentoinha
  } else {
    local.refrigeracaoLigada = ventoinhaRefrigeracao(local.refrigeracaoLigada, false, chaveEmNormal)
    aquecedorLigado = local.ordem === 'CALOR'
  }

  const { alvo, k } = alvoTermico({
    perfil,
    ordem: local.ordem,
    aquecedorLigado,
    ventoinhaEmergencia,
    refrigeracaoLigada: local.refrigeracaoLigada,
  })
  local.temperatura = passoTermico(local.temperatura, alvo, k, dtMin)
  // Sem C-Shield ninguém mede: a exposição (°C·min acima do máximo) é integrada aqui.
  if (!local.protegido && local.temperatura > perfil.tMax) {
    local.exposicao += (local.temperatura - perfil.tMax) * dtMin
  }

  const ultimo = local.historico[local.historico.length - 1]
  if (!ultimo || tSimMs - ultimo.tSimMin * 60000 >= HISTORICO_INTERVALO_SIM_MS) {
    local.historico.push({ tSimMin: tSimMs / 60000, temperatura: local.temperatura })
    if (local.historico.length > HISTORICO_MAX_PONTOS) local.historico.shift()
  }
}

// Avança o jogo `dtRealMs` milissegundos reais, em ciclos de 2 s simulados.
export function passo(cidade, dtRealMs) {
  const nova = structuredClone(cidade)
  const total = nova.restoSimMs + dtRealMs * MS_SIM_POR_MS_REAL
  const ciclos = Math.floor(total / PERIODO_LEITURA_MS)
  nova.restoSimMs = total - ciclos * PERIODO_LEITURA_MS
  for (let i = 0; i < ciclos; i++) {
    nova.relogioSimMs += PERIODO_LEITURA_MS
    for (const def of LOCAIS) {
      cicloLocal(nova.locais[def.id], PERFIS_EMULADOR[def.perfil], nova.relogioSimMs)
    }
  }
  return nova
}

// ---------------------------------------------------------------------------
// Proteção e liberação
// ---------------------------------------------------------------------------

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

// Liberação presencial (botão segurado por 3 s). Só vale depois da trava mínima; antes disso é
// recusada e o bloqueio continua. Aceita, a pessoa também desfaz a ordem do atacante no
// controlador, e o próximo ciclo leva liberacao: true.
export function liberar(cidade, localId) {
  const nova = structuredClone(cidade)
  const local = nova.locais[localId]
  if (!local || !local.protegido || !local.contexto.bloqueado) return nova
  const decorrido = nova.relogioSimMs - local.contexto.inicioBloqueioMs
  if (decorrido < TRAVA_SIM_MS) {
    local.liberacaoRecusada = true
    return nova
  }
  local.liberacaoRecusada = false
  local.liberacaoPendente = true
  local.ordem = 'NORMAL'
  return nova
}

// ---------------------------------------------------------------------------
// Ataque em massa e recomeço
// ---------------------------------------------------------------------------

// Ataca os 5 locais de uma vez. Como todos caem no mesmo instante, o coordenado é detectado na
// hora, com n = 5 e 0 s (D8).
export function ataqueEmMassa(cidade, tipo, agoraRealMs) {
  let nova = cidade
  for (const def of LOCAIS) nova = atacar(nova, def.id, tipo, agoraRealMs)
  return nova
}

// Volta ao começo do jogo (W18).
export function recomecar() {
  return criarCidade()
}

// Quanto falta da trava mínima de um local, em ms simulados (0 se não há bloqueio ou já passou).
export function travaRestanteSimMs(local, relogioSimMs) {
  if (!local.contexto.bloqueado) return 0
  return Math.max(0, TRAVA_SIM_MS - (relogioSimMs - local.contexto.inicioBloqueioMs))
}
