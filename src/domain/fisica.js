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
 * fisica.js — modelo térmico ILUSTRATIVO do emulador. Não é a física real: a DPS calibra o modelo
 * de verdade. Serve só para a temperatura da câmara reagir de forma crível ao ataque e à
 * proteção. Lei de Newton por passo: T += (alvo − T) × (1 − e^(−k·dtMin)); como o fator fica
 * entre 0 e 1, a temperatura converge para o alvo e nunca passa dele.
 */
import { K_ATAQUE, K_NORMAL, K_PROTECAO, SETPOINT_DEMO_ATAQUE } from './config.js'

// Quanto o ataque de frio empurra a temperatura abaixo do mínimo da faixa.
const FOLGA_ATAQUE_FRIO_C = 12
// Nos congelados o ataque de calor leva a câmara a tMax + 30 °C (45 °C seria absurdo).
const FOLGA_ATAQUE_CALOR_CONGELADO_C = 30

// Para onde a temperatura caminha, e com que velocidade, na situação descrita.
//   perfil               { tMin, tMax, tAlvo }
//   ordem                'NORMAL' | 'CALOR' | 'FRIO': o que o atacante manda ao controlador
//   aquecedorLigado      o aquecedor está aquecendo (liberado e atuando)
//   ventoinhaEmergencia  a ventoinha de emergência do C-Shield está ligada
//   refrigeracaoLigada   a refrigeração do controlador comercial está funcionando
// Devolve { alvo, k } (k em 1/min).
//   calor sem proteção: 45 °C (setpoint do atacante) ou tMax + 30 nos congelados;
//   calor com o aquecedor cortado e a ventoinha ligada: tAlvo, mais rápido;
//   frio sem proteção: tMin − 12; frio com o aquecedor liberado: tAlvo, mais rápido;
//   normal (ou calor com a refrigeração ainda ligada): tAlvo, devagar.
export function alvoTermico({ perfil, ordem, aquecedorLigado, ventoinhaEmergencia, refrigeracaoLigada }) {
  const normal = { alvo: perfil.tAlvo, k: K_NORMAL }
  const protegido = { alvo: perfil.tAlvo, k: K_PROTECAO }

  if (ordem === 'CALOR' && !refrigeracaoLigada) {
    if (!aquecedorLigado && ventoinhaEmergencia) return protegido
    const alvo = perfil.tMax < 0 ? perfil.tMax + FOLGA_ATAQUE_CALOR_CONGELADO_C : SETPOINT_DEMO_ATAQUE
    return { alvo, k: K_ATAQUE }
  }
  if (ordem === 'FRIO') {
    if (aquecedorLigado) return protegido
    return { alvo: perfil.tMin - FOLGA_ATAQUE_FRIO_C, k: K_ATAQUE }
  }
  return normal
}

// Um passo do modelo: dtMin é o intervalo em minutos simulados.
export function passoTermico(temperatura, alvo, k, dtMin) {
  return temperatura + (alvo - temperatura) * (1 - Math.exp(-k * dtMin))
}
