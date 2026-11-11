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
 * incidentes.js — regras do incidente (registro de um bloqueio): conjuntos válidos, rótulos em
 * português simples, validação dos campos e montagem do payload enviado à API. Função pura: o
 * acesso à API fica em services/mockapi.js. O campo `inicio` segue como o texto recebido (a API
 * guarda a data como texto); quem desenha formata para a tela.
 */

export const STATUS = ['ABERTO', 'EM_ANALISE', 'RESOLVIDO']
export const TIPOS = ['CALOR', 'FRIO']
// Os motivos que o C-Shield pode registrar num bloqueio (nomes canônicos do Edge).
export const MOTIVOS_BLOQUEIO = [
  'SETPOINT_INVALIDO',
  'DEGELO_FORA_HORARIO',
  'DEGELO_LONGO',
  'AQUECIMENTO_RAPIDO',
  'RESFRIAMENTO_RAPIDO',
  'TEMP_FORA_TOLERANCIA',
]

// Palavras do dia a dia para a tela (o código segue com os nomes canônicos).
export const ROTULOS = {
  status: { ABERTO: 'Aberto', EM_ANALISE: 'Em análise', RESOLVIDO: 'Resolvido' },
  tipo: { CALOR: 'Calor', FRIO: 'Frio' },
  motivo: {
    SETPOINT_INVALIDO: 'Ordem de temperatura perigosa',
    DEGELO_FORA_HORARIO: 'Degelo fora de hora',
    DEGELO_LONGO: 'Degelo longo demais',
    AQUECIMENTO_RAPIDO: 'Esquentou rápido demais',
    RESFRIAMENTO_RAPIDO: 'Esfriou rápido demais',
    TEMP_FORA_TOLERANCIA: 'Temperatura fora do limite',
  },
  origem: { emulador: 'Emulador', manual: 'Manual' },
}

const ACAO_MAX = 300
const TEXTO_MIN = 2
const TEXTO_MAX = 60

const vazio = (v) => v === undefined || v === null || String(v).trim() === ''

// Número do formulário: aceita vírgula e campo vazio (vale 0). NaN se não for número ≥ 0.
function paraNumero(v) {
  if (vazio(v)) return 0
  const n = Number(String(v).trim().replace(',', '.'))
  return Number.isFinite(n) && n >= 0 ? n : NaN
}

function erroTexto(valor, mensagem) {
  const t = String(valor ?? '').trim()
  return t.length >= TEXTO_MIN && t.length <= TEXTO_MAX ? null : mensagem
}

// Erros de status e ação tomada (compartilhados entre o formulário novo e a edição).
function errosStatusEAcao({ status, acaoTomada }) {
  const erros = {}
  if (!STATUS.includes(status)) erros.status = 'Escolha o status do incidente.'
  const acao = String(acaoTomada ?? '').trim()
  if (acao.length > ACAO_MAX) erros.acaoTomada = `Escreva no máximo ${ACAO_MAX} letras.`
  else if (status === 'RESOLVIDO' && acao === '') {
    erros.acaoTomada = 'Para marcar como resolvido, conte o que foi feito.'
  }
  return erros
}

// Validação do formulário completo. Devolve { campo: mensagem }; vazio = tudo certo.
export function validarIncidente(d) {
  const erros = {}
  const nome = erroTexto(d.localNome, 'Informe o nome do local (de 2 a 60 letras).')
  if (nome) erros.localNome = nome
  const bairro = erroTexto(d.bairro, 'Informe o bairro (de 2 a 60 letras).')
  if (bairro) erros.bairro = bairro
  if (!TIPOS.includes(d.tipo)) erros.tipo = 'Escolha calor ou frio.'
  if (!MOTIVOS_BLOQUEIO.includes(d.motivo)) erros.motivo = 'Escolha o que aconteceu.'
  if (vazio(d.inicio) || Number.isNaN(Date.parse(d.inicio))) {
    erros.inicio = 'Informe uma data e hora válidas.'
  }
  if (Number.isNaN(paraNumero(d.tempoReacaoS))) {
    erros.tempoReacaoS = 'Use um número maior ou igual a zero.'
  }
  if (Number.isNaN(paraNumero(d.exposicao))) {
    erros.exposicao = 'Use um número maior ou igual a zero.'
  }
  return { ...erros, ...errosStatusEAcao(d) }
}

// Validação da edição: só status e ação tomada podem mudar.
export function validarEdicao({ status, acaoTomada }) {
  return errosStatusEAcao({ status, acaoTomada })
}

// Payload de um incidente criado à mão em /incidentes.
export function novoIncidenteManual(form) {
  return {
    origem: 'manual',
    localId: 'manual',
    localNome: String(form.localNome).trim(),
    bairro: String(form.bairro).trim(),
    tipo: form.tipo,
    motivo: form.motivo,
    inicio: form.inicio,
    tempoReacaoS: paraNumero(form.tempoReacaoS),
    exposicao: paraNumero(form.exposicao),
    status: form.status ?? 'ABERTO',
    acaoTomada: String(form.acaoTomada ?? '').trim(),
  }
}
