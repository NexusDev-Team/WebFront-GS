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
 * nomes.js — nomes canônicos de estados e motivos, iguais aos do Edge (decisao.h) e aos atributos
 * `state` e `reason` do Orion. Prioridade: CRITICO > BLOQUEIO > FALHA_SENSOR > ATENCAO > NORMAL.
 */

// Nomes canônicos (iguais ao Edge, sem variações).
export const ESTADOS = {
  NORMAL: 'NORMAL',
  ATENCAO: 'ATENCAO',
  BLOQUEIO: 'BLOQUEIO',
  CRITICO: 'CRITICO',
  FALHA_SENSOR: 'FALHA_SENSOR',
}

export const MOTIVOS = {
  NENHUM: '-',
  PORTA_ABERTA: 'PORTA_ABERTA',
  DERIVA: 'DERIVA',
  SETPOINT_INVALIDO: 'SETPOINT_INVALIDO',
  DEGELO_FORA_HORARIO: 'DEGELO_FORA_HORARIO',
  DEGELO_LONGO: 'DEGELO_LONGO',
  AQUECIMENTO_RAPIDO: 'AQUECIMENTO_RAPIDO',
  RESFRIAMENTO_RAPIDO: 'RESFRIAMENTO_RAPIDO',
  TEMP_FORA_TOLERANCIA: 'TEMP_FORA_TOLERANCIA',
  SENSOR_SEM_LEITURA: 'SENSOR_SEM_LEITURA',
}
