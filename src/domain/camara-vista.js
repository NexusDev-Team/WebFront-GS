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
 * camara-vista.js — o que se vê dentro da câmara de um local: LCD, LED, equipamentos e a ordem
 * que o controlador está recebendo. Função pura, para o painel só desenhar. O tempo do LCD é
 * em segundos REAIS (o jogo é acelerado, mas o LCD diz "Liberacao em 9s", não "9m").
 */
import { MS_SIM_POR_MS_REAL, setpointDaOrdem, travaRestanteSimMs } from './cidade.js'
import { corLed } from './cshield-saida.js'
import { telaBoot, telaEstado, telaLiberado, telaLiberando, telaSemBloqueio, telaTrava } from './lcd.js'

// Estado do aquecedor: calor sem corte esquenta (ligado); calor com o C-Shield cortando fica
// cortado; no frio, o C-Shield libera o aquecedor (ligado); sem ataque, parado.
function estadoDoAquecedor(local) {
  const d = local.decisao
  if (local.ordem === 'CALOR') return local.protegido && d?.cortaAquecedor ? 'cortado' : 'ligado'
  if (local.ordem === 'FRIO') return local.protegido && d?.bloqueado ? 'ligado' : 'parado'
  return 'parado'
}

// Tela do LCD, por prioridade: segurando o botão > aviso temporário > estado da decisão.
function telaDoLcd({ local, perfil, relogioSimMs, agoraRealMs, progressoLiberacao, aviso }) {
  const restanteRealMs = travaRestanteSimMs(local, relogioSimMs) / MS_SIM_POR_MS_REAL
  if (progressoLiberacao > 0) return telaLiberando(progressoLiberacao * 100)
  if (aviso && agoraRealMs < aviso.ateRealMs) {
    if (aviso.tipo === 'TRAVA') return telaTrava(restanteRealMs)
    if (aviso.tipo === 'LIBERADO') return telaLiberado()
    if (aviso.tipo === 'SEM_BLOQUEIO') return telaSemBloqueio()
  }
  if (!local.decisao) return telaBoot()
  const decisao = { ...local.decisao, travaRestanteMs: restanteRealMs }
  return telaEstado(decisao, { valida: true, temperatura: local.temperatura }, agoraRealMs, perfil)
}

// aviso: null | { tipo: 'TRAVA' | 'LIBERADO' | 'SEM_BLOQUEIO', ateRealMs }.
export function vistaDaCamara({ local, perfil, relogioSimMs, agoraRealMs, progressoLiberacao = 0, aviso = null }) {
  const decisao = local.decisao
  return {
    temCShield: local.protegido,
    lcd: local.protegido
      ? telaDoLcd({ local, perfil, relogioSimMs, agoraRealMs, progressoLiberacao, aviso })
      : null,
    corLed: local.protegido ? (decisao ? corLed(decisao) : 'verde') : null,
    equipamentos: {
      aquecedor: estadoDoAquecedor(local),
      ventoinhaEmergencia: Boolean(local.protegido && decisao?.ligaVentoinha),
      refrigeracao: local.refrigeracaoLigada,
    },
    controlador: local.ordem === 'NORMAL' ? 'NORMAL' : 'ATAQUE',
    setpointMandado: setpointDaOrdem(perfil, local.ordem),
    faixa: { tMin: perfil.tMin, tMax: perfil.tMax },
  }
}
