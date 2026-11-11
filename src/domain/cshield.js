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
  ALARME_INICIAL_MS,
  CONFIRMACOES,
  DEGELO_MAX_MS,
  DHT_TEMP_MAX_FISICA,
  DHT_TEMP_MIN_FISICA,
  HORA_DEGELO_1,
  HORA_DEGELO_2,
  JANELA_DEGELO_H,
  LIMIAR_PORTA_PCT,
  SETPOINT_AUSENTE,
  TAXA_MAX_C_POR_MIN,
  TAXA_MAX_RESFRIAMENTO_C_POR_MIN,
  TRAVA_MS,
} from './config.js'
import { calcularTaxa, registrarAmostra } from './historico.js'
import { ESTADOS, MOTIVOS } from './nomes.js'
import { perfilAtivo } from './perfis.js'

// Reexporta para quem já importa tudo de cshield.js.
export { calcularTaxa } from './historico.js'
export { ESTADOS, MOTIVOS } from './nomes.js'

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

  // Intervalo desde o ciclo anterior, em minutos (para integrar a exposição).
  const dtMin = ctx.iniciado ? (agoraMs - ctx.ultimoMs) / 60000 : 0

  // --- 1. Sensor, histórico, exposição e CRITICO ---
  if (leitura.valida) {
    ctx.contInvalido = 0
    registrarAmostra(ctx, leitura.temperatura, agoraMs)
    if (leitura.temperatura > p.tMax) ctx.exposicao += (leitura.temperatura - p.tMax) * dtMin
    const alemTolerancia =
      leitura.temperatura > p.tMax + p.tolerancia || leitura.temperatura < p.tMin - p.tolerancia
    ctx.contCritico = alemTolerancia ? ctx.contCritico + 1 : 0
  } else {
    ctx.contInvalido++
    ctx.contCritico = 0 // sem leitura não há como confirmar temperatura ruim
  }
  const falhaSensor = ctx.contInvalido >= CONFIRMACOES
  const critico = ctx.contCritico >= CONFIRMACOES
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

  // --- 2. Liberação presencial (só depois da trava mínima) ---
  if (ctx.bloqueado && leitura.liberacao && agoraMs - ctx.inicioBloqueioMs < travaMs) {
    d.liberacaoRecusada = true // avisa o usuário (LCD) em vez de falhar em silêncio
  }
  if (ctx.bloqueado && leitura.liberacao && agoraMs - ctx.inicioBloqueioMs >= travaMs) {
    d.liberou = true
    ctx.bloqueado = false
    ctx.motivoBloqueio = MOTIVOS.NENHUM
    // O histórico da janela de 60 s pertence ao episódio que acabou de ser bloqueado. Sem
    // descartá-lo, a subida antiga reabriria o bloqueio por "aquecimento rápido" no mesmo
    // instante da liberação, mesmo com a temperatura já estável.
    ctx.histTemp = []
    ctx.histMs = []
    if (leitura.valida) registrarAmostra(ctx, leitura.temperatura, agoraMs)
  }

  // --- 3. Julgar a ordem do controlador (ou ignorá-la durante a trava) ---
  const taxa = calcularTaxa(ctx)
  d.taxaCPorMin = taxa

  if (ctx.bloqueado) {
    const mudouSp = leitura.temSetpoint && leitura.setpoint !== ctx.ultimoSetpoint
    d.mudancaIgnorada = mudouSp || leitura.degelo !== ctx.ultimoDegelo
  } else {
    let violada = MOTIVOS.NENHUM
    // Regra 1: setpoint fora da faixa do produto (julga a ordem antes do efeito).
    if (leitura.temSetpoint && (leitura.setpoint < p.tMin || leitura.setpoint > p.tMax)) {
      violada = MOTIVOS.SETPOINT_INVALIDO
      // Regra 2: degelo por tempo demais, ou fora dos horários permitidos (hora válida).
    } else if (leitura.degelo && ctx.degeloAtivo && agoraMs - ctx.inicioDegeloMs > DEGELO_MAX_MS) {
      violada = MOTIVOS.DEGELO_LONGO
    } else if (leitura.degelo && leitura.horaValida && !degeloPermitidoNaHora(leitura.hora)) {
      violada = MOTIVOS.DEGELO_FORA_HORARIO
      // Regra 3: aquecimento rápido com a porta fechada (porta aberta é só ATENCAO).
    } else if (leitura.valida && !falhaSensor && !porta && taxa > TAXA_MAX_C_POR_MIN) {
      violada = MOTIVOS.AQUECIMENTO_RAPIDO
      // Regra 4, o espelho da 3: resfriamento rápido. Frio demais também estraga (sangue, vacina).
      // A porta aberta não explica esfriar, então não alivia a regra. Só vale abaixo do centro da
      // faixa: voltar do calor até o centro (a ventoinha esfriando) não é ataque.
    } else if (
      leitura.valida &&
      !falhaSensor &&
      leitura.temperatura < (p.tMin + p.tMax) / 2 &&
      taxa < -TAXA_MAX_RESFRIAMENTO_C_POR_MIN
    ) {
      violada = MOTIVOS.RESFRIAMENTO_RAPIDO
    }
    if (violada !== MOTIVOS.NENHUM) {
      // Direção do ataque: setpoint abaixo da faixa e resfriamento rápido são ataques de FRIO.
      ctx.bloqueioFrio =
        violada === MOTIVOS.RESFRIAMENTO_RAPIDO ||
        (violada === MOTIVOS.SETPOINT_INVALIDO && leitura.setpoint < p.tMin)
      ctx.bloqueado = true
      ctx.inicioBloqueioMs = agoraMs
      ctx.motivoBloqueio = violada
      ctx.bloqueios++
      d.novoBloqueio = true
    }
  }

  // --- Estado final pela prioridade e ações nos relés ---
  const deriva = leitura.valida && (leitura.temperatura < p.tMin || leitura.temperatura > p.tMax)
  if (critico) {
    d.estado = ESTADOS.CRITICO
    d.motivo = ctx.bloqueado ? ctx.motivoBloqueio : MOTIVOS.TEMP_FORA_TOLERANCIA
  } else if (ctx.bloqueado) {
    d.estado = ESTADOS.BLOQUEIO
    d.motivo = ctx.motivoBloqueio
  } else if (falhaSensor) {
    d.estado = ESTADOS.FALHA_SENSOR
    d.motivo = MOTIVOS.SENSOR_SEM_LEITURA
  } else if (porta) {
    d.estado = ESTADOS.ATENCAO
    d.motivo = MOTIVOS.PORTA_ABERTA
  } else if (deriva) {
    d.estado = ESTADOS.ATENCAO
    d.motivo = MOTIVOS.DERIVA
  }

  // Resposta nos relés, sempre para o lado que protege o produto:
  //   calor: corta o aquecedor e liga a ventoinha de emergência;
  //   frio:  deixa o aquecedor liberado e NÃO liga a ventoinha (esfriar mais estragaria o produto).
  // A temperatura medida manda; com ela dentro da faixa vale a direção do ataque.
  // Nunca mexe no compressor: o C-Shield só veta o que aumenta o risco.
  const atua = ctx.bloqueado || critico
  const muitoQuente = leitura.valida && leitura.temperatura > p.tMax
  const muitoFrio = leitura.valida && leitura.temperatura < p.tMin
  const modoCalor = muitoQuente || (!muitoFrio && !ctx.bloqueioFrio)
  d.cortaAquecedor = atua && modoCalor
  d.ligaVentoinha = atua && modoCalor

  // Apito: toca enquanto o bloqueio (ou o crítico) estiver com a temperatura fora da faixa, e
  // para quando ela regulariza. O bloqueio NÃO acaba com o apito: só a liberação presencial.
  // Sem leitura válida não dá para saber se regularizou, então o apito continua. Nos primeiros
  // ALARME_INICIAL_MS de um bloqueio o apito toca de qualquer jeito (ataque com temperatura boa).
  const inicioDoBloqueio = ctx.bloqueado && agoraMs - ctx.inicioBloqueioMs < ALARME_INICIAL_MS
  d.bloqueado = ctx.bloqueado
  d.alarme = (ctx.bloqueado || critico) && (!leitura.valida || deriva || inicioDoBloqueio)
  d.exposicao = ctx.exposicao
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
