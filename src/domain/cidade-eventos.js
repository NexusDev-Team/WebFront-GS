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
 * cidade-eventos.js — o que aconteceu entre duas fotos da cidade. O passo do jogo roda vários
 * ciclos de uma vez, então a decisão do último ciclo não basta para saber se um bloqueio
 * começou ou se uma liberação foi aceita: aqui se compara a cidade antes e depois.
 */

// Devolve { novosBloqueios: [localId], liberados: [localId] }.
//   novo bloqueio: o contador de bloqueios do local aumentou;
//   liberado: o local estava bloqueado e deixou de estar.
// Se o relógio voltou atrás, a cidade foi recomeçada: não há eventos.
export function eventosDoPasso(antes, depois) {
  const novosBloqueios = []
  const liberados = []
  if (depois.relogioSimMs < antes.relogioSimMs) return { novosBloqueios, liberados }
  for (const [id, local] of Object.entries(depois.locais)) {
    const anterior = antes.locais[id]
    if (!anterior) continue
    if (local.contexto.bloqueios > anterior.contexto.bloqueios) novosBloqueios.push(id)
    if (anterior.contexto.bloqueado && !local.contexto.bloqueado) liberados.push(id)
  }
  return { novosBloqueios, liberados }
}

// O que aconteceu com um pedido de liberação, olhando a cidade devolvida por liberar():
//   SEM_BLOQUEIO  o local não estava bloqueado (nada a liberar);
//   RECUSADA      a trava mínima ainda não acabou;
//   ACEITA        a liberação vale no próximo ciclo.
export function resultadoDaLiberacao(cidadeDepois, localId) {
  const local = cidadeDepois.locais[localId]
  if (!local.contexto.bloqueado) return 'SEM_BLOQUEIO'
  return local.liberacaoRecusada ? 'RECUSADA' : 'ACEITA'
}
