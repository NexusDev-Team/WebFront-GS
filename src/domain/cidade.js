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

// ---------------------------------------------------------------------------
// Passo do tempo
// ---------------------------------------------------------------------------

// Tempo do jogo: cada ms real vale 60 ms simulados (1 s real = 1 min simulado).
const MS_SIM_POR_MS_REAL = EMULADOR_MINUTOS_POR_SEGUNDO * 60
// A trava mínima do emulador é de 10 s reais (D6), ou seja, 10 min simulados.
const TRAVA_SIM_MS = EMULADOR_TRAVA_MS_REAL * MS_SIM_POR_MS_REAL
// Um ponto do histórico a cada 10 s simulados; guarda os últimos 120 (cerca de 20 min simulados).
const HISTORICO_INTERVALO_SIM_MS = 10000
const HISTORICO_MAX_PONTOS = 120

// Setpoint que o controlador comercial está mandando, conforme a ordem do atacante.
// Calor: 45 °C (ou tMax + 30 nos congelados). Frio: tMin − 12. Normal: o alvo do perfil.
function setpointDaOrdem(perfil, ordem) {
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
