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
 * config.js — espelho das constantes de edge/cshield/config.h usadas pela decisão e pelo LCD.
 * Os valores são os do firmware (em divergência, vale o config.h) e cada um traz a justificativa
 * original. Tempos em milissegundos, temperaturas em °C.
 */

// ---------------------------------------------------------------------------
// Sensoriamento
// ---------------------------------------------------------------------------

// 2 s é o mínimo de intervalo do DHT22; ler mais rápido devolve NaN.
export const PERIODO_LEITURA_MS = 2000

// Um estado de alarme (CRITICO, FALHA_SENSOR) só vale após 2 ciclos seguidos,
// para um pico isolado do sensor não disparar o alarme.
export const CONFIRMACOES = 2

// Faixa física válida do DHT22: fora dela o valor é erro de leitura, não temperatura.
export const DHT_TEMP_MIN_FISICA = -40
export const DHT_TEMP_MAX_FISICA = 80

// Luminosidade (LDR, em %) acima disso significa porta aberta: a luz da sala entra
// na câmara escura. 40% dá folga para a luz interna da câmara.
export const LIMIAR_PORTA_PCT = 40

// ---------------------------------------------------------------------------
// Regras de bloqueio
// ---------------------------------------------------------------------------

// Janela de 60 s para calcular a taxa de aquecimento: longa o bastante para suavizar
// ruído, curta o bastante para reagir a um ataque em segundos.
export const JANELA_TAXA_MS = 60000

// Amostras na janela da taxa (uma a cada PERIODO_LEITURA_MS, mais a de ponta).
export const N_AMOSTRAS_TAXA = Math.floor(JANELA_TAXA_MS / PERIODO_LEITURA_MS) + 1

// Intervalo mínimo entre a amostra mais antiga e a mais nova para calcular a taxa.
// Abaixo disso a conta amplifica ruído (poucos segundos dão taxas enormes).
export const TAXA_MIN_INTERVALO_MS = 10000

// VALOR PROVISÓRIO: 0,5 °C/min de aquecimento com a porta fechada é o limite
// inicial. A DPS da equipe vai calibrar com a maquete (modelo de Newton).
export const TAXA_MAX_C_POR_MIN = 0.5

// VALOR PROVISÓRIO, espelho do anterior: resfriamento acima de 0,5 °C/min (abaixo do centro da
// faixa) é tratado como ataque que esfria. A DPS calibra junto com a taxa de aquecimento.
export const TAXA_MAX_RESFRIAMENTO_C_POR_MIN = 0.5

// Degelo comandado por mais de 30 min é suspeito: um degelo normal é curto.
export const DEGELO_MAX_MS = 30 * 60 * 1000

// Horários permitidos para degelo (hora cheia, relógio local). Fora deles, com hora
// válida por NTP, a ordem de degelo é considerada perigosa.
export const HORA_DEGELO_1 = 6
export const HORA_DEGELO_2 = 18
// Cada janela dura 1 hora (06:00 a 07:00 e 18:00 a 19:00).
export const JANELA_DEGELO_H = 1

// Trava mínima de bloqueio: o botão de liberação só vale depois dela. 30 min no uso real;
// 60 s no modo demonstração (MODO_DEMO = 1 do firmware), para caber no vídeo de 7 min.
export const TRAVA_MS = 60 * 1000

// Segurar o botão por 3 s evita liberação por toque acidental.
export const LIBERACAO_MS = 3000

// ---------------------------------------------------------------------------
// Setpoint observado (chave de 2 posições do Wokwi)
// ---------------------------------------------------------------------------

// Chave em NORMAL: setpoint dentro da faixa da vacina (2 a 8 °C). Chave em ATAQUE: valor quente,
// fora da faixa, que dispara o bloqueio.
export const SETPOINT_DEMO_NORMAL = 5
export const SETPOINT_DEMO_ATAQUE = 45

// Valor enviado em `setpoint` quando não há setpoint observado.
export const SETPOINT_AUSENTE = -999

// ---------------------------------------------------------------------------
// Alertas locais
// ---------------------------------------------------------------------------

// Meio período do pisca do LED amarelo (FALHA_SENSOR).
export const LED_PISCA_MS = 400

// Aviso sonoro inicial do bloqueio: o apito só toca enquanto a temperatura está fora da
// faixa, mas um ataque com a temperatura ainda boa também precisa ser ouvido.
export const ALARME_INICIAL_MS = 5000

// A linha 2 do LCD alterna entre a temperatura e as mensagens do estado a cada 2 s.
export const ALTERNA_TELA_MS = 2000

// ---------------------------------------------------------------------------
// Demonstração do emulador (não existe no firmware — D6)
// ---------------------------------------------------------------------------

// No emulador a trava mínima real é de 10 s, para a pessoa não esperar um minuto.
export const EMULADOR_TRAVA_MS_REAL = 10000

// Tempo simulado: 1 minuto da câmara passa a cada 1 s reais.
export const EMULADOR_MINUTOS_POR_SEGUNDO = 1

// Modelo térmico do emulador (fisica.js), em 1/min de tempo simulado (1 min = 1 s real). É um
// jogo: tudo acontece rápido. O ataque faz a câmara cruzar o limite da faixa em
// TEMPO_ATE_SAIR_MIN (cerca de 1 s real), para qualquer perfil; a proteção do C-Shield e o
// repouso são ainda mais rápidos. Valores ilustrativos, não a física real.
export const TEMPO_ATE_SAIR_MIN = 1
export const K_ATAQUE = 0.1
export const K_PROTECAO = 1
export const K_NORMAL = 0.3
