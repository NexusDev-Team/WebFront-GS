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
 * camaras.js — o cadastro "câmara fria do seu bairro", o CRUD em API externa do site: a pessoa
 * cadastra uma câmara que conhece (nome, bairro, o que guarda e uma observação) e depois lista,
 * edita ou exclui. Aqui ficam os tipos, a validação, o payload enviado à API e o filtro por tipo.
 * Funções puras; o acesso à API fica em services/mockapi.js.
 */

// O que a câmara guarda: os mesmos 4 perfis do emulador.
export const TIPOS = ['VACINA', 'PLASMA', 'INSULINA', 'CONGELADO']

// Palavras do dia a dia para a tela.
export const ROTULOS_TIPO = {
  VACINA: 'Vacinas',
  PLASMA: 'Sangue e plasma',
  INSULINA: 'Insulina e remédios',
  CONGELADO: 'Comida congelada',
}

const TEXTO_MIN = 2
const TEXTO_MAX = 60
const OBSERVACAO_MAX = 200

function erroTexto(valor, mensagem) {
  const t = String(valor ?? '').trim()
  return t.length >= TEXTO_MIN && t.length <= TEXTO_MAX ? null : mensagem
}

// Validação do formulário. Devolve { campo: mensagem }; vazio = tudo certo.
export function validarCamara({ nome, bairro, tipo, observacao }) {
  const erros = {}
  const erroNome = erroTexto(nome, 'Informe o nome do lugar (de 2 a 60 letras).')
  if (erroNome) erros.nome = erroNome
  const erroBairro = erroTexto(bairro, 'Informe o bairro (de 2 a 60 letras).')
  if (erroBairro) erros.bairro = erroBairro
  if (!TIPOS.includes(tipo)) erros.tipo = 'Escolha o que a câmara guarda.'
  if (String(observacao ?? '').trim().length > OBSERVACAO_MAX) {
    erros.observacao = `Escreva no máximo ${OBSERVACAO_MAX} letras.`
  }
  return erros
}

// Campos do formulário já limpos (textos aparados), sem a data: usados também na edição.
export function camposDaCamara({ nome, bairro, tipo, observacao }) {
  return {
    nome: String(nome).trim(),
    bairro: String(bairro).trim(),
    tipo,
    observacao: String(observacao ?? '').trim(),
  }
}

// Registro enviado à API ao cadastrar. `cadastradaEmIso` vem de quem chama (o domínio não lê o relógio).
export function novaCamara(form, cadastradaEmIso) {
  return { ...camposDaCamara(form), cadastradoEm: cadastradaEmIso }
}

// true se a câmara passa no filtro da lista (tipo vazio = sem filtro).
export function casaComTipo(camara, tipo) {
  return !tipo || camara.tipo === tipo
}
