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
import { K_ATAQUE, K_NORMAL, K_PROTECAO, TEMPO_ATE_SAIR_MIN } from './config.js'

// Alvo do ataque: o valor para o qual a câmara caminha de modo a cruzar o limite da faixa
// exatamente em TEMPO_ATE_SAIR_MIN, partindo do tAlvo. Vem de inverter a lei de Newton:
//   limite = tAlvo + (alvo − tAlvo)(1 − e^(−k·T))  =>  alvo = tAlvo + (limite − tAlvo)/(1 − e^(−k·T)).
// Assim todos os perfis reagem no mesmo ritmo, e o jogo fica previsível.
function alvoDoAtaque(perfil, limite) {
  return perfil.tAlvo + (limite - perfil.tAlvo) / (1 - Math.exp(-K_ATAQUE * TEMPO_ATE_SAIR_MIN))
}

// Para onde a temperatura caminha, e com que velocidade, na situação descrita.
//   perfil               { tMin, tMax, tAlvo }
//   ordem                'NORMAL' | 'CALOR' | 'FRIO': o que o atacante manda ao controlador
//   aquecedorLigado      o aquecedor está aquecendo (liberado e atuando)
//   ventoinhaEmergencia  a ventoinha de emergência do C-Shield está ligada
//   refrigeracaoLigada   a refrigeração do controlador comercial está funcionando
// Devolve { alvo, k } (k em 1/min).
//   calor sem proteção: além do máximo, rápido (alvoDoAtaque);
//   calor com o aquecedor cortado e a ventoinha ligada: tAlvo, mais rápido;
//   frio sem proteção: abaixo do mínimo, rápido; frio com o aquecedor liberado: tAlvo, mais rápido;
//   normal (ou calor com a refrigeração ainda ligada): tAlvo, devagar.
export function alvoTermico({ perfil, ordem, aquecedorLigado, ventoinhaEmergencia, refrigeracaoLigada }) {
  const normal = { alvo: perfil.tAlvo, k: K_NORMAL }
  const protegido = { alvo: perfil.tAlvo, k: K_PROTECAO }

  if (ordem === 'CALOR' && !refrigeracaoLigada) {
    if (!aquecedorLigado && ventoinhaEmergencia) return protegido
    return { alvo: alvoDoAtaque(perfil, perfil.tMax), k: K_ATAQUE }
  }
  if (ordem === 'FRIO') {
    if (aquecedorLigado) return protegido
    return { alvo: alvoDoAtaque(perfil, perfil.tMin), k: K_ATAQUE }
  }
  return normal
}

// Um passo do modelo: dtMin é o intervalo em minutos simulados.
export function passoTermico(temperatura, alvo, k, dtMin) {
  return temperatura + (alvo - temperatura) * (1 - Math.exp(-k * dtMin))
}
