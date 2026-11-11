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
 * cshield-saida.js — saídas derivadas da decisão do C-Shield: cor do LED (atuadores.h), ventoinha
 * de refrigeração simulada (simulacao.h) e relés deduzidos do que o FIWARE publica.
 * Separado do cshield.js para manter cada arquivo focado.
 */
import { SETPOINT_DEMO_ATAQUE, SETPOINT_DEMO_NORMAL } from './config.js'
import { ESTADOS, MOTIVOS, temperaturaValida } from './cshield.js'
import { PERFIS_FIRMWARE } from './perfis.js'

// Ventoinha de refrigeração do controlador (LED verde no Wokwi; a do controlador, não a de
// emergência). Sem bloqueio ela segue a chave NORMAL/ATAQUE: o ataque a desliga. Com o bloqueio
// ativo a chave perde a função de ataque: só é possível LIGAR a ventoinha de novo (chave em
// NORMAL), nunca desligá-la.
export function ventoinhaRefrigeracao(ligadaAntes, bloqueado, chaveEmNormal) {
  if (!bloqueado) return chaveEmNormal
  return ligadaAntes || chaveEmNormal
}

// Cor do LED RGB a partir da decisão.
//   Bloqueio ativo: AZUL fixo até alguém liberar (vale também com a temperatura em crítico).
//   NORMAL verde · ATENCAO amarelo fixo · CRITICO vermelho fixo · FALHA_SENSOR amarelo piscando.
// O pisca é devolvido como 'amarelo-pisca' e quem desenha anima com CSS (no máximo 3 por
// segundo); por isso a função não precisa do relógio.
export function corLed(decisao) {
  if (decisao.bloqueado) return 'azul'
  switch (decisao.estado) {
    case ESTADOS.NORMAL:
      return 'verde'
    case ESTADOS.ATENCAO:
      return 'amarelo'
    case ESTADOS.BLOQUEIO:
      return 'azul' // só por segurança: bloqueado já cobre este caso
    case ESTADOS.CRITICO:
      return 'vermelho'
    case ESTADOS.FALHA_SENSOR:
      return 'amarelo-pisca'
    default:
      return 'verde'
  }
}

// Deduz o que os relés estão fazendo a partir do que o dispositivo publica no Orion (o firmware
// não publica os relés). Atua só em BLOQUEIO e CRITICO. Frio = RESFRIAMENTO_RAPIDO ou setpoint
// abaixo da faixa; calor é o resto. A temperatura medida manda (acima da faixa é calor, abaixo
// é frio); com ela dentro da faixa, ou sem leitura (-999), vale a direção do ataque — a mesma
// regra do decisao.h. `controlador` diz que ordem o atacante está mandando.
export function relesPublicados({ state, reason, temperature, setpoint }, perfil = PERFIS_FIRMWARE.VACINA) {
  const atua = state === ESTADOS.BLOQUEIO || state === ESTADOS.CRITICO
  const ataqueFrio =
    reason === MOTIVOS.RESFRIAMENTO_RAPIDO ||
    (reason === MOTIVOS.SETPOINT_INVALIDO && setpoint < perfil.tMin)
  const valida = temperaturaValida(temperature)
  const muitoQuente = valida && temperature > perfil.tMax
  const muitoFrio = valida && temperature < perfil.tMin
  const modoCalor = muitoQuente || (!muitoFrio && !ataqueFrio)

  let controlador = 'DESCONHECIDO'
  if (setpoint === SETPOINT_DEMO_NORMAL) controlador = 'NORMAL'
  else if (setpoint === SETPOINT_DEMO_ATAQUE) controlador = 'ATAQUE'

  return { cortaAquecedor: atua && modoCalor, ligaVentoinha: atua && modoCalor, controlador }
}
