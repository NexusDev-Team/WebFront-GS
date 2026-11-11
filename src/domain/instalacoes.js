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
 * instalacoes.js — as instalações do C-Shield: cada registro diz que um local da cidade tem o
 * aparelho instalado (criar = instalar, editar = apelido e observação, excluir = remover). Aqui
 * ficam a validação, o payload enviado à API e a regra "não remover com o ataque bloqueado".
 * Funções puras; o acesso à API fica em services/mockapi.js. A faixa segura NUNCA é cadastro:
 * ela é gravada no dispositivo e não muda pela rede (W26).
 */
import { ID_PILOTO, LOCAIS } from './cidade.js'

const APELIDO_MAX = 40
const OBSERVACAO_MAX = 200

// Erros de apelido e observação (iguais ao instalar e ao editar).
function errosDeTexto({ apelido, observacao }) {
  const erros = {}
  if (String(apelido ?? '').trim().length > APELIDO_MAX) {
    erros.apelido = `Use no máximo ${APELIDO_MAX} letras.`
  }
  if (String(observacao ?? '').trim().length > OBSERVACAO_MAX) {
    erros.observacao = `Use no máximo ${OBSERVACAO_MAX} letras.`
  }
  return erros
}

// Validação do formulário de instalar. Devolve { campo: mensagem }; vazio = tudo certo.
export function validarInstalacao(form, idsJaInstalados) {
  const erros = {}
  if (!LOCAIS.some((l) => l.id === form.localId)) erros.localId = 'Escolha um local da lista.'
  else if (form.localId === ID_PILOTO) erros.localId = 'A unidade piloto já vem com o C-Shield.'
  else if (idsJaInstalados.includes(form.localId)) erros.localId = 'Este local já tem o C-Shield.'
  return { ...erros, ...errosDeTexto(form) }
}

// Validação da edição: só apelido e observação mudam.
export function validarEdicaoInstalacao(form) {
  return errosDeTexto(form)
}

// Registro enviado à API ao instalar. `instaladoEmIso` vem de quem chama (o domínio não lê o relógio).
export function novaInstalacao(form, instaladoEmIso) {
  return {
    localId: form.localId,
    apelido: String(form.apelido ?? '').trim(),
    observacao: String(form.observacao ?? '').trim(),
    instaladoEm: instaladoEmIso,
  }
}

// Ids dos locais com instalação cadastrada: sem repetir, sem o piloto e sem locais desconhecidos.
export function idsInstalados(lista) {
  const validos = new Set(LOCAIS.map((l) => l.id).filter((id) => id !== ID_PILOTO))
  return [...new Set(lista.map((i) => i.localId))].filter((id) => validos.has(id))
}

// O bloqueio só termina presencialmente: com o ataque bloqueado, não dá para remover o C-Shield.
export function podeRemover(local) {
  return !local.contexto.bloqueado
}

export function motivoNaoRemover(local) {
  return podeRemover(local) ? '' : 'Libere o bloqueio no local primeiro.'
}
