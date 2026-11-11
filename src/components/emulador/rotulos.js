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
 * rotulos.js — as palavras do emulador, em linguagem do dia a dia (nada de jargão), e as cores
 * de cada situação. Cor nunca vem sozinha (W49): sempre acompanha o texto.
 */

export const ROTULO_SITUACAO = {
  NORMAL: 'Normal',
  SOB_ATAQUE: 'Sob ataque',
  ATAQUE_BLOQUEADO: 'Ataque bloqueado',
  SEGURO: 'Seguro',
  SEGURO_LOTE_EM_ANALISE: 'Seguro · lote em análise',
}

// Cor de cada situação: vermelho = ataque, azul forte = o C-Shield no controle, verde = seguro,
// amarelo = atenção (lote a conferir), azul fraco = repouso (só traço, nunca texto).
export const COR_SITUACAO = {
  NORMAL: 'var(--color-led-fraco)',
  SOB_ATAQUE: 'var(--color-ataque)',
  ATAQUE_BLOQUEADO: 'var(--color-led-forte)',
  SEGURO: 'var(--color-ok)',
  SEGURO_LOTE_EM_ANALISE: 'var(--color-atencao)',
}

// Texto para leitor de tela quando a situação de algum local muda. `antes` e `depois` são
// { localId: situacao }; `nomes` é { localId: nome }. Com 3 ou mais mudanças de uma vez, resume.
export function anunciarMudancas(antes, depois, nomes) {
  const mudou = Object.keys(depois).filter((id) => antes[id] !== depois[id])
  if (mudou.length === 0) return ''
  if (mudou.length >= 3) return `${mudou.length} locais mudaram de situação.`
  return mudou.map((id) => `${nomes[id]}: ${ROTULO_SITUACAO[depois[id]].toLowerCase()}.`).join(' ')
}
