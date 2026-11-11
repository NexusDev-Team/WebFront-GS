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

// Auxiliares dos testes portados de edge/test/test_decisao.cpp (mesmos nomes e valores).
import { avaliar, criarContexto } from '../src/domain/cshield.js'

export const T0 = 100000 // instante inicial dos testes
export const PASSO = 2000 // um ciclo de leitura

// Leitura "tudo bem" no perfil de vacina: 5 °C, porta fechada, setpoint 5 °C, sem degelo.
export function base() {
  return {
    valida: true,
    temperatura: 5.0,
    umidade: 80.0,
    luzPct: 10.0,
    temSetpoint: true,
    setpoint: 5.0,
    degelo: false,
    horaValida: true,
    hora: 12,
    liberacao: false,
  }
}

export function quase(a, b, eps = 0.001) {
  return Math.abs(a - b) < eps
}

// Em C++ o Contexto é mutado por avaliar(). Aqui avaliar() é pura (devolve um contexto novo),
// então a sessão guarda o contexto atual e deixa os testes com a mesma cara do original:
//   const s = sessao(); const d = s.avalia(leitura, T0); s.ctx.bloqueado ...
export function sessao(opcoes = {}) {
  const s = {
    ctx: criarContexto(),
    avalia(leitura, agoraMs) {
      const r = avaliar(leitura, s.ctx, agoraMs, opcoes)
      s.ctx = r.contexto
      return r.decisao
    },
  }
  return s
}

// Provoca um bloqueio por setpoint inválido e devolve o instante do ciclo.
export function bloquearPorSetpoint(s) {
  const l = base()
  l.setpoint = 40.0
  s.avalia(l, T0)
  return T0
}
