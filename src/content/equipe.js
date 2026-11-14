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
 * equipe.js — os integrantes da Nexus Dev para a página da equipe. Nomes e RMs são os do
 * cabeçalho do grupo. As fotos (recortes quadrados de 256 px no rosto) ficam em public/equipe/,
 * com o nome indicado abaixo; se uma não carregar, a página mostra um avatar com as iniciais.
 * A função de cada um (hoje "Função a definir") não aparece em nenhuma página.
 */

const FUNCAO_PENDENTE = 'Função a definir'

// "Isac Nilton Fernandes de Oliveira" → "IO": primeira letra do primeiro e do último nome.
export function iniciaisDe(nome) {
  const partes = nome.trim().split(/\s+/)
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

const integrante = (nome, rm, slug) => ({
  nome,
  rm,
  funcao: FUNCAO_PENDENTE,
  foto: `/equipe/${slug}.jpg`,
  iniciais: iniciaisDe(nome),
})

export const EQUIPE = [
  integrante('Isac Nilton Fernandes de Oliveira', 'RM573282', 'isac-nilton'),
  integrante('João Benedito de Oliveira Simplício', 'RM570206', 'joao-benedito'),
  integrante('Leonardo Formigari', 'RM573291', 'leonardo-formigari'),
  integrante('Luis Fernando', 'RM570959', 'luis-fernando'),
  integrante('Nicolas Cinel', 'RM572940', 'nicolas-cinel'),
]
