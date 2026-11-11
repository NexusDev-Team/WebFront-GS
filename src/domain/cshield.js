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
 * cshield.js — lógica PURA de decisão do C-Shield, porta de edge/cshield/decisao.h.
 *
 * Não depende de React nem de relógio: recebe a leitura, a memória entre ciclos (contexto) e o
 * tempo em milissegundos, e devolve a decisão. Em divergência com o site, vale o decisao.h.
 * A política aqui é fixa: nunca é alterada pela rede.
 * Prioridade dos estados: CRITICO > BLOQUEIO > FALHA_SENSOR > ATENCAO > NORMAL.
 */
import {
  DHT_TEMP_MAX_FISICA,
  DHT_TEMP_MIN_FISICA,
  LIMIAR_PORTA_PCT,
  SETPOINT_AUSENTE,
} from './config.js'
import { perfilAtivo } from './perfis.js'

// Nomes canônicos (iguais ao Edge, sem variações).
export const ESTADOS = {
  NORMAL: 'NORMAL',
  ATENCAO: 'ATENCAO',
  BLOQUEIO: 'BLOQUEIO',
  CRITICO: 'CRITICO',
  FALHA_SENSOR: 'FALHA_SENSOR',
}

export const MOTIVOS = {
  NENHUM: '-',
  PORTA_ABERTA: 'PORTA_ABERTA',
  DERIVA: 'DERIVA',
  SETPOINT_INVALIDO: 'SETPOINT_INVALIDO',
  DEGELO_FORA_HORARIO: 'DEGELO_FORA_HORARIO',
  DEGELO_LONGO: 'DEGELO_LONGO',
  AQUECIMENTO_RAPIDO: 'AQUECIMENTO_RAPIDO',
  RESFRIAMENTO_RAPIDO: 'RESFRIAMENTO_RAPIDO',
  TEMP_FORA_TOLERANCIA: 'TEMP_FORA_TOLERANCIA',
  SENSOR_SEM_LEITURA: 'SENSOR_SEM_LEITURA',
}

// ---------------------------------------------------------------------------
// Funções auxiliares (puras)
// ---------------------------------------------------------------------------

// true se a temperatura é utilizável: não é NaN e está na faixa física do DHT22.
export function temperaturaValida(t) {
  if (typeof t !== 'number' || Number.isNaN(t)) return false
  return t >= DHT_TEMP_MIN_FISICA && t <= DHT_TEMP_MAX_FISICA
}

// true se a luminosidade indica porta aberta.
export function portaAberta(luzPct) {
  return luzPct > LIMIAR_PORTA_PCT
}

// Zera toda a memória entre ciclos (iniciarContexto do firmware).
export function criarContexto() {
  return {
    iniciado: false,
    ultimoMs: 0,
    bloqueado: false,
    inicioBloqueioMs: 0,
    motivoBloqueio: MOTIVOS.NENHUM,
    bloqueioFrio: false,
    bloqueios: 0,
    exposicao: 0,
    degeloAtivo: false,
    inicioDegeloMs: 0,
    contCritico: 0,
    contInvalido: 0,
    histTemp: [],
    histMs: [],
    ultimoSetpoint: SETPOINT_AUSENTE,
    ultimoDegelo: false,
  }
}

// ---------------------------------------------------------------------------
// Decisão de um ciclo
// ---------------------------------------------------------------------------

// Avalia a leitura e devolve { decisao, contexto }. NÃO muta o contexto recebido: trabalha numa
// cópia e devolve a nova, para servir ao estado do React.
export function avaliar(leitura, contexto, agoraMs, opcoes = {}) {
  const ctx = structuredClone(contexto)
  const p = opcoes.perfil ?? perfilAtivo()
  const d = {
    estado: ESTADOS.NORMAL,
    motivo: MOTIVOS.NENHUM,
    cortaAquecedor: false,
    ligaVentoinha: false,
    novoBloqueio: false,
    mudancaIgnorada: false,
    liberou: false,
    liberacaoRecusada: false,
    bloqueado: false,
    alarme: false,
    taxaCPorMin: 0,
    exposicao: ctx.exposicao,
    travaRestanteMs: 0,
  }

  const porta = portaAberta(leitura.luzPct)
  const deriva = leitura.valida && (leitura.temperatura < p.tMin || leitura.temperatura > p.tMax)
  if (porta) {
    d.estado = ESTADOS.ATENCAO
    d.motivo = MOTIVOS.PORTA_ABERTA
  } else if (deriva) {
    d.estado = ESTADOS.ATENCAO
    d.motivo = MOTIVOS.DERIVA
  }

  ctx.iniciado = true
  ctx.ultimoMs = agoraMs
  return { decisao: d, contexto: ctx }
}
