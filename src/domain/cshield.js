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
  DEGELO_MAX_MS,
  DHT_TEMP_MAX_FISICA,
  DHT_TEMP_MIN_FISICA,
  HORA_DEGELO_1,
  HORA_DEGELO_2,
  JANELA_DEGELO_H,
  LIMIAR_PORTA_PCT,
  SETPOINT_AUSENTE,
  TRAVA_MS,
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

// true se o degelo é permitido nessa hora (janelas de HORA_DEGELO_1 e HORA_DEGELO_2).
export function degeloPermitidoNaHora(hora) {
  return (
    (hora >= HORA_DEGELO_1 && hora < HORA_DEGELO_1 + JANELA_DEGELO_H) ||
    (hora >= HORA_DEGELO_2 && hora < HORA_DEGELO_2 + JANELA_DEGELO_H)
  )
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

  const travaMs = opcoes.travaMs ?? TRAVA_MS
  const porta = portaAberta(leitura.luzPct)

  // Acompanha o tempo do degelo comandado.
  if (leitura.degelo) {
    if (!ctx.degeloAtivo) {
      ctx.degeloAtivo = true
      ctx.inicioDegeloMs = agoraMs
    }
  } else {
    ctx.degeloAtivo = false
  }

  // --- Julgar a ordem do controlador (só quando não há bloqueio ativo) ---
  if (!ctx.bloqueado) {
    let violada = MOTIVOS.NENHUM
    // Regra 1: setpoint fora da faixa do produto (julga a ordem antes do efeito).
    if (leitura.temSetpoint && (leitura.setpoint < p.tMin || leitura.setpoint > p.tMax)) {
      violada = MOTIVOS.SETPOINT_INVALIDO
      // Regra 2: degelo por tempo demais, ou fora dos horários permitidos (hora válida).
    } else if (leitura.degelo && ctx.degeloAtivo && agoraMs - ctx.inicioDegeloMs > DEGELO_MAX_MS) {
      violada = MOTIVOS.DEGELO_LONGO
    } else if (leitura.degelo && leitura.horaValida && !degeloPermitidoNaHora(leitura.hora)) {
      violada = MOTIVOS.DEGELO_FORA_HORARIO
    }
    if (violada !== MOTIVOS.NENHUM) {
      ctx.bloqueado = true
      ctx.inicioBloqueioMs = agoraMs
      ctx.motivoBloqueio = violada
      ctx.bloqueios++
      d.novoBloqueio = true
    }
  }

  // --- Estado final pela prioridade e ações nos relés ---
  const deriva = leitura.valida && (leitura.temperatura < p.tMin || leitura.temperatura > p.tMax)
  if (ctx.bloqueado) {
    d.estado = ESTADOS.BLOQUEIO
    d.motivo = ctx.motivoBloqueio
  } else if (porta) {
    d.estado = ESTADOS.ATENCAO
    d.motivo = MOTIVOS.PORTA_ABERTA
  } else if (deriva) {
    d.estado = ESTADOS.ATENCAO
    d.motivo = MOTIVOS.DERIVA
  }

  // Resposta nos relés (calor: corta o aquecedor e liga a ventoinha de emergência).
  d.cortaAquecedor = ctx.bloqueado
  d.ligaVentoinha = ctx.bloqueado

  d.bloqueado = ctx.bloqueado
  if (ctx.bloqueado) {
    const decorrido = agoraMs - ctx.inicioBloqueioMs
    d.travaRestanteMs = decorrido >= travaMs ? 0 : travaMs - decorrido
  }

  // Memória para o próximo ciclo.
  ctx.iniciado = true
  ctx.ultimoMs = agoraMs
  if (leitura.temSetpoint) ctx.ultimoSetpoint = leitura.setpoint
  ctx.ultimoDegelo = leitura.degelo
  return { decisao: d, contexto: ctx }
}
