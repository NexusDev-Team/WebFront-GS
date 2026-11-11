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
 * lcd.js — telas do LCD 16x2, porta de edge/cshield/painel.h.
 *
 * Cada função devolve [linha1, linha2] com no máximo 16 caracteres (sem acento, como o LCD real;
 * o grau é o símbolo °). Quem desenha completa com espaços até 16 colunas.
 *
 * Telas de estado seguem o mesmo molde: linha 1 "Estado: <nome>"; linha 2 alterna a cada
 * ALTERNA_TELA_MS entre "Temp: 5.0°C" e as mensagens do estado (motivo, o que fazer, exposição).
 */
import { ALTERNA_TELA_MS, LIBERACAO_MS } from './config.js'
import { ESTADOS, MOTIVOS } from './cshield.js'
import { NOME_PRODUTO } from './produto.js'
import { PERFIS_FIRMWARE } from './perfis.js'

const COLUNAS = 16

// O LCD descarta o que passa de 16 colunas; aqui o texto é cortado do mesmo jeito.
function ajustar(texto) {
  return texto.slice(0, COLUNAS)
}

// Nome do estado na linha 1. Em NORMAL a temperatura está na faixa ideal.
const NOME_ESTADO_LCD = {
  [ESTADOS.NORMAL]: 'Ideal',
  [ESTADOS.ATENCAO]: 'Atencao',
  [ESTADOS.BLOQUEIO]: 'Bloqueio',
  [ESTADOS.CRITICO]: 'Critico',
  [ESTADOS.FALHA_SENSOR]: 'Falha',
}

// Motivo do bloqueio em até 16 colunas. A alteração de setpoint mostra só o motivo: o valor
// recebido não aparece (a temperatura da câmara já tem a sua própria mensagem).
const MOTIVO_NO_LCD = {
  [MOTIVOS.SETPOINT_INVALIDO]: 'Alt. de Setpoint',
  [MOTIVOS.DEGELO_FORA_HORARIO]: 'Degelo fora hora',
  [MOTIVOS.DEGELO_LONGO]: 'Degelo longo',
  [MOTIVOS.AQUECIMENTO_RAPIDO]: 'Aquec. rapido',
  [MOTIVOS.RESFRIAMENTO_RAPIDO]: 'Resfria rapido',
}

// Segundos restantes da trava: a partir de 100 s mostra em minutos.
function tempoRestante(travaRestanteMs, prefixo) {
  const s = Math.floor(travaRestanteMs / 1000)
  return s >= 100 ? `${prefixo}${Math.floor(s / 60)}m` : `${prefixo}${s}s`
}

// Tela do estado atual. `leitura` traz a temperatura; `decisao`, o estado, o motivo, a trava
// restante e a exposição; `agoraMs` faz a linha 2 alternar entre as mensagens.
export function telaEstado(decisao, leitura, agoraMs, perfil = PERFIS_FIRMWARE.VACINA) {
  const l1 = `Estado: ${NOME_ESTADO_LCD[decisao.estado] ?? '?'}`

  // Mensagens da linha 2: a temperatura primeiro e depois as do estado.
  const msg = []
  if (leitura.valida) msg.push(`Temp: ${leitura.temperatura.toFixed(1)}°C`)

  switch (decisao.estado) {
    case ESTADOS.ATENCAO:
      msg.push(decisao.motivo === MOTIVOS.PORTA_ABERTA ? 'Porta aberta' : 'Temp fora faixa')
      break
    case ESTADOS.BLOQUEIO: {
      msg.push(MOTIVO_NO_LCD[decisao.motivo] ?? 'Bloqueio ativo')
      if (leitura.valida && (leitura.temperatura > perfil.tMax || leitura.temperatura < perfil.tMin)) {
        msg.push('Restaurando temp')
      }
      if (Math.floor(decisao.travaRestanteMs / 1000) > 0) {
        msg.push(tempoRestante(decisao.travaRestanteMs, 'Liberacao em '))
      } else {
        msg.push(`Segure botao ${LIBERACAO_MS / 1000}s`)
      }
      break
    }
    case ESTADOS.CRITICO:
      if (decisao.bloqueado) msg.push('Bloqueio ativo')
      msg.push(`Exposicao ${decisao.exposicao.toFixed(1)}`)
      break
    case ESTADOS.FALHA_SENSOR:
      msg.push('Sensor sem dado')
      break
    default:
      break
  }
  if (msg.length === 0) msg.push('Lendo sensor...')

  const indice = Math.floor(agoraMs / ALTERNA_TELA_MS) % msg.length
  return [ajustar(l1), ajustar(msg[indice])]
}

// Botão segurado durante a trava mínima: avisa por que ainda não vai liberar.
export function telaTrava(travaRestanteMs) {
  return ['Trava ativa', ajustar(tempoRestante(travaRestanteMs, 'Aguarde '))]
}

// Confirmação mostrada logo depois de a liberação presencial ser aceita.
export function telaLiberado() {
  return ['Estado: Liberado', 'Controle normal']
}

// Botão apertado sem nenhum bloqueio ativo: não há nada a liberar.
export function telaSemBloqueio() {
  return ['Sem bloqueio', 'Nada a liberar']
}

// Tela de liberação: título e barra de 16 blocos que enche em LIBERACAO_MS (progresso de 0 a 100).
export function telaLiberando(progressoPct) {
  const cheios = Math.max(0, Math.min(COLUNAS, Math.floor((progressoPct * COLUNAS) / 100)))
  return ['Liberando...', '█'.repeat(cheios)]
}

// Tela de boot: nome do produto (constante única) e "Iniciando...".
export function telaBoot() {
  return [NOME_PRODUTO, 'Iniciando...']
}
