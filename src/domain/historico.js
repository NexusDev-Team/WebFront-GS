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
 * historico.js — janela de temperatura usada para calcular a taxa de variação (°C/min).
 * Funções puras sobre o contexto de cshield.js (histTemp e histMs).
 */
import { JANELA_TAXA_MS, N_AMOSTRAS_TAXA, TAXA_MIN_INTERVALO_MS } from './config.js'

// Guarda a temperatura no histórico e descarta o que saiu da janela de JANELA_TAXA_MS.
export function registrarAmostra(ctx, temp, agoraMs) {
  if (ctx.histTemp.length >= N_AMOSTRAS_TAXA) {
    // cheio: descarta a mais antiga
    ctx.histTemp.shift()
    ctx.histMs.shift()
  }
  ctx.histTemp.push(temp)
  ctx.histMs.push(agoraMs)
  // Remove amostras mais velhas que a janela, sempre mantendo ao menos a mais nova.
  while (ctx.histTemp.length > 1 && agoraMs - ctx.histMs[0] > JANELA_TAXA_MS) {
    ctx.histTemp.shift()
    ctx.histMs.shift()
  }
}

// Taxa de variação da temperatura em °C/min (positiva = aquecendo), medida entre a amostra mais
// antiga e a mais nova da janela. 0 se ainda não há intervalo suficiente.
export function calcularTaxa(ctx) {
  const n = ctx.histTemp.length
  if (n < 2) return 0
  const dt = ctx.histMs[n - 1] - ctx.histMs[0]
  if (dt < TAXA_MIN_INTERVALO_MS) return 0
  return (ctx.histTemp[n - 1] - ctx.histTemp[0]) / (dt / 60000)
}
