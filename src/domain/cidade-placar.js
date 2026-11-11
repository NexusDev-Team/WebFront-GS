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
 * cidade-placar.js — leituras da cidade para a tela: situação de cada local (W17) e placar
 * comparando a UBS com C-Shield e a sem (W19). Só lê a cidade; quem a altera é o cidade.js.
 */

// Acima desta exposição (°C·min acima do máximo) o lote precisa de análise mesmo depois de
// o local voltar ao normal. Abaixo disso a perda é desprezível e o local fica só "seguro".
export const EXPOSICAO_MAX_SEGURA = 1

// Situação de um local, em uma palavra para a tela:
//   NORMAL                  nada aconteceu
//   SOB_ATAQUE              atacado e sem proteção: a temperatura sobe (ou cai) sem ninguém reagir
//   ATAQUE_BLOQUEADO        o C-Shield barrou o ataque e segura o bloqueio até alguém liberar
//   SEGURO                  liberado depois do ataque, sem estrago
//   SEGURO_LOTE_EM_ANALISE  liberado, mas o lote ficou exposto e precisa ser conferido
export function situacao(local) {
  const bloqueado = local.decisao?.bloqueado === true
  if (bloqueado) return 'ATAQUE_BLOQUEADO'
  if (local.ordem !== 'NORMAL') return 'SOB_ATAQUE'
  if (!local.houveAtaque) return 'NORMAL'
  return local.exposicao > EXPOSICAO_MAX_SEGURA ? 'SEGURO_LOTE_EM_ANALISE' : 'SEGURO'
}
