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
 * useCShield — a câmara de um local vista por dentro: LCD, LED, equipamentos e a ordem do
 * controlador. A regra está em domain/camara-vista.js; este hook só dá o relógio real, que
 * atualiza a cada 1 s (é o que faz a linha 2 do LCD alternar e os avisos temporários sumirem).
 */
import { useEffect, useState } from 'react'
import { perfilDoLocal } from '../domain/cidade.js'
import { vistaDaCamara } from '../domain/camara-vista.js'

const CICLO_MS = 1000

// `aviso` = null | { tipo: 'TRAVA' | 'LIBERADO' | 'SEM_BLOQUEIO', ateRealMs }.
export function useCShield(cidade, localId, { progressoLiberacao = 0, aviso = null } = {}) {
  const [agoraRealMs, setAgoraRealMs] = useState(Date.now)

  useEffect(() => {
    const id = setInterval(() => setAgoraRealMs(Date.now()), CICLO_MS)
    return () => clearInterval(id)
  }, [])

  return vistaDaCamara({
    local: cidade.locais[localId],
    perfil: perfilDoLocal(localId),
    relogioSimMs: cidade.relogioSimMs,
    agoraRealMs,
    progressoLiberacao,
    aviso,
  })
}
