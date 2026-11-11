# Design — site do C-Shield (c-shield-web)

Fase A, T3 do `docs/PROMPT-WEB.md`. Requisitos citados como W1..W52 (`requirements.md`).

## 1. Direção: "Sala de controle às 2h da manhã"

A câmara fria vista de madrugada, pelo painel de quem a protege. A interface é uma sala escura com instrumentos acesos: tudo em repouso é azul fraco e estável; o ataque entra como vermelho e falha de energia; o C-Shield assumindo é azul forte e firme — o mesmo significado do LED do aparelho. **A luz conta a história antes do texto.**

Tese de interação (o que torna o site memorável, sem virar enfeite):

1. **A cor é estado, não decoração.** Verde, amarelo e vermelho só aparecem em indicadores de estado; o azul forte só aparece quando o C-Shield está no controle. Quem aprende isso na home lê o emulador sem legenda.
2. **O ataque tem direção e se quebra.** Linhas vermelhas andam do atacante até o local; no local protegido elas se rompem no escudo. Linhas azuis de dados só vão do local para a central — a promessa "só envia" vira desenho.
3. **Segurar é um gesto físico.** O botão de liberação precisa ser segurado por 3 s com barra de progresso de 16 blocos, como o LCD do aparelho. "Só obedece de perto" é sentido na mão.
4. **Tempo comprimido, mas honesto.** O relógio do ataque corre acelerado (1 s = 1 min) e o rótulo "tempo acelerado" fica sempre visível.

Validação com `ui-ux-pro-max` (11/11): o banco recomenda o padrão "Real-Time / Operations Landing" com estilo "Dark Mode (OLED)", status em verde/âmbar/vermelho e brilho mínimo (`text-shadow: 0 0 10px`) — coerente com a direção da equipe. A tipografia sugerida pelo banco (Fira) foi descartada: a equipe já decidiu Chakra Petch + IBM Plex + VT323, que dá mais identidade.

## 2. Tokens

Definidos uma vez em `src/styles/tokens.css` (variáveis CSS) e expostos no `tailwind.config.js`. Componentes nunca usam hex solto.

| Token | Valor | Uso |
| --- | --- | --- |
| `noite-950` | `#050B14` | Fundo da página |
| `noite-900` | `#0A1626` | Fundo de seções |
| `painel` | `rgba(14, 32, 56, 0.45)` + `backdrop-blur` | Painéis translúcidos (só o fundo é translúcido) |
| `borda` | `rgba(125, 211, 252, 0.18)` | Bordas finas |
| `gelo-50` | `#EAF6FF` | Texto principal |
| `gelo-300` | `#9CC9E8` | Texto secundário |
| `led-fraco` | `#1E6FA3` | Azul de repouso (bordas, linhas, brilhos) |
| `led-forte` | `#38BDF8` | "O C-Shield assumiu" |
| `ok` / `atencao` / `critico` | `#22C55E` / `#EAB308` / `#EF4444` | Só indicadores de estado |
| `ataque` | `#FF3B4E` | Linhas e brilho do ataque |
| `lcd-fundo` / `lcd-texto` | `#A8C64E` / `#1B2A0B` | LCD 16x2 |

### Contraste medido (WCAG, sobre `noite-950` / `noite-900` / painel ≈ `#0F2135`)

| Cor | 950 | 900 | painel | Regra |
| --- | --- | --- | --- | --- |
| `gelo-50` | 17,97 | 16,55 | 14,83 | texto livre |
| `gelo-300` | 11,21 | 10,33 | 9,26 | texto livre |
| `led-forte` | 9,21 | 8,48 | 7,60 | texto livre |
| `ok` | 8,66 | 7,97 | 7,15 | texto livre |
| `atencao` | 10,29 | 9,48 | 8,49 | texto livre |
| `ataque` | 5,63 | 5,18 | 4,64 | texto livre |
| `critico` | 5,24 | 4,83 | **4,33** | texto pequeno só sobre 950/900; no painel, só texto ≥ 18,66 px negrito ou ícone |
| `led-fraco` | **3,62** | **3,34** | **2,99** | **nunca texto**; só borda, linha, brilho, ícone grande decorativo |
| LCD | — | — | — | `lcd-texto` sobre `lcd-fundo`: 7,85 |

Consequência: rótulos de "repouso" usam `gelo-300`, não `led-fraco`.

### Tipografia (Google Fonts, `display=swap`, com fallback)

- Títulos: **Chakra Petch** 600–700 (fallback `system-ui, sans-serif`).
- Texto: **IBM Plex Sans** 400/500, base 16 px, `line-height` 1.5.
- Números e leituras: **IBM Plex Mono** com `font-variant-numeric: tabular-nums`.
- LCD: **VT323**, 16 colunas fixas.

### Efeitos (classes próprias em `src/styles/efeitos.css`)

- `led-brilho` — `text-shadow`/`box-shadow` azul suave e estável.
- `led-fraco` — o mesmo brilho, com opacidade baixa, para decoração.
- `led-falha` — brilho irregular de bateria fraca (keyframes com no máximo 3 quedas por segundo). Só durante ataque.
- `led-forte` — brilho firme em `led-forte` para "o C-Shield assumiu".
- Todas desligam o movimento em `@media (prefers-reduced-motion: reduce)` (trocam para cor estática).

Movimento: transições de interface entre 150 e 300 ms; nada anima `width`/`height` (só `transform` e `opacity`); canvas com `requestAnimationFrame`, pausado com `visibilitychange`.

Ícones: SVG próprios inline (atacante, central, escudo, frasco, gota de sangue, carrinho, cruz de farmácia). Sem emoji como ícone.

### Camada "hacker + gelo" (decisão do João, 11/11)

O tema é ataque cibernético a refrigeradores, então a sala de controle mistura duas linguagens visuais, cada uma com um dono:

- **Hacker = o invasor.** Terminal, código, falha de sinal. Aparece no que vem da rede e no ataque: prompts de terminal, texto em leet nos botões de ataque, glitch e `ataque` vermelho.
- **Gelo = o C-Shield e a cadeia do frio.** Cristal, geada, escudo com floco de neve (a logo do C-Shield). Aparece no que protege: painéis com geada nas bordas, escudo, `led-forte`.

Durante um ataque, o hacker "racha" o gelo (glitch); quando o C-Shield assume, o gelo volta firme. A tese "a cor é estado" continua valendo: nenhum elemento dessa camada usa verde, amarelo ou vermelho fora do papel de estado ou de ataque.

Elementos:

- **Logo** em SVG próprio (`ui/Logo.jsx`): escudo com floco de neve de 6 braços em traço `led-forte`, wordmark "C-SHIELD" em Chakra Petch 700 e o slogan "Segurança inteligente para câmaras frias." em `gelo-300`. Variantes: completa, compacta (só escudo + nome) e só o escudo. O nome sai de `NOME_PRODUTO`.
- **Prompt de terminal** (`ui/PromptTerminal.jsx`): rótulos e sobretítulos em IBM Plex Mono no formato `> cshield --status` ou `$ sala_vacina_01`, com cursor `▌` piscando a 1 Hz (para com reduced-motion). Texto em `gelo-300`, prompt `>` em `led-forte`.
- **Grade de sala de controle:** fundo da página com linhas finas a cada 32 px na cor `grade` (borda a 6%), estática.
- **Scanlines:** sobre os painéis, `repeating-linear-gradient` com opacidade de no máximo 4%, estático (nunca sobre o LCD).
- **Geada:** cantos dos painéis com um brilho radial `geada` (branco-gelo a 6%) e cantoneiras de HUD (`[ ]`) em `borda`. O texto continua opaco.
- **Glitch de ataque** (`glitch-ataque`): deslocamento RGB do texto (`ataque` e `led-forte` a 2 px) em keyframes de no máximo 3 quedas por segundo, só junto com `led-falha` e só durante ataque. Com reduced-motion vira uma troca estática de cor.
- **Cristais:** padrão hexagonal (geometria do floco de neve) em SVG a 3–4% de opacidade, só em fundos de seção grandes.

Tokens novos (decorativos, nunca em texto):

| Token | Valor | Uso |
| --- | --- | --- |
| `geada` | `rgba(234, 246, 255, 0.06)` | Brilho de geada nos cantos dos painéis |
| `grade` | `rgba(125, 211, 252, 0.06)` | Grade do fundo e scanlines |

Nenhuma cor de texto nova, então a tabela de contraste acima não muda.

## 3. Esboço das páginas

### Layout comum

```
┌ Navbar: [logo C-Shield]  Início  Emulador  Dispositivo real  Incidentes  Como funciona ┐
│                                                     (celular: botão menu, painel lateral) │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ <main> página                                                                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Footer: "Vê de longe. Só obedece de perto." · Edge · Wokwi · Nexus Vision · GS 2026.2      │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### `/` — scrollytelling (W5–W9)

```
[canvas FundoBinario fixo atrás]
 Cap. 1  02:00. Câmara de vacinas. Tudo em ordem.        [SVG geladeira fechada, luz fraca]
 Cap. 2  Uma ordem chega pela internet: 45 °C.            [porta abre, faíscas, título led-falha,
         Ninguém entrou no prédio.                          termômetro subindo]
 Cap. 3  O C-Shield não obedece.                          [binário para, porta fecha, led-forte]
         Vê de longe. Só obedece de perto.
 Cap. 4  Na Europa: 3h30 até alguém perceber.             [fundo calmo]
         Com o C-Shield: segundos.   [Ataque uma cidade →]
```

Cada capítulo ocupa ~100 vh, texto num painel com véu escuro. Desktop: texto à esquerda, geladeira à direita (sticky). Celular: geladeira acima, texto abaixo. Reduced-motion: geladeira estática por capítulo, binário parado.

### `/emulador` (W10–W29)

```
┌ Cabeçalho: "Seja o hacker"  · rótulo "tempo acelerado: 1 s = 1 min"                     ┐
├───────────────────────────────────────────────┬──────────────────────────────────────────┤
│ MapaCidade (SVG)                              │ PlacarComparativo                        │
│  [atacante]──vermelho──▶ locais               │  UBS Vila Mariana  |  UBS Brasilândia    │
│  5 LocalNoMapa  ── azul ──▶ Central (FIWARE)  │  temp / reação / exposição / situação   │
│                                               │  "Mesma cidade, mesmo ataque, mesma hora"│
│ ControlesAtaque: [Ataque em massa] [Ativar C-Shield] [Recomeçar]                         │
│ local selecionado: [4T4QU3 D3 C4L0R] [4T4QU3 D3 FR10]                                    │
├───────────────────────────────────────────────┴──────────────────────────────────────────┤
│ PainelCamara: Lcd16x2 · LedEstado · Equipamento(aquecedor: resistência acesa/cortada)    │
│               Equipamento(ventoinha de emergência: gira/parada)                          │
│               Equipamento(refrigeração do controlador: ligada/parada) · Rele(1 e 2)      │
│               "Controlador: NORMAL | ATAQUE (setpoint 45 °C)" — o papel da chave do Wokwi│
│               GraficoTemperatura (faixa segura sombreada) · BotaoSegurar (3 s)           │
│               Faixa segura "gravada no dispositivo" (só leitura)                         │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ WokwiEmbed (iframe ou cartão) · [Abrir simulador real →]                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

Celular: mapa em largura total, placar abaixo em duas colunas compactas, controles em grade 2×2 com alvos de 44 px. Teclado: cada local é um botão no SVG (`role="button"`, `tabindex="0"`, Enter/Espaço seleciona).

### `/simulador-real` (W36–W43)

```
┌ "Dispositivo real" · status [● ao vivo | ● offline]                                     ┐
│ LedEstado grande + estado + motivo       │ Temperatura grande (Plex Mono)               │
│ Bloqueios · Exposição · Setpoint · Porta │ GraficoTemperatura (STH-Comet)               │
│ "Nem este site consegue dar ordens ao C-Shield."                                        │
│ offline: última leitura + "Abra a simulação no Wokwi para ver ao vivo" + [Emulador →]   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### `/incidentes` (W30–W35)

```
┌ "Incidentes" · [+ Novo incidente]                                                       ┐
│ FiltrosIncidentes: status [Todos|Aberto|Em análise|Resolvido] · tipo [Todos|Calor|Frio] │
│ IncidenteItem: local · bairro · tipo · motivo · início · reação · exposição · status     │
│                [Editar] [Excluir → confirmação inline: "Excluir? [Sim] [Cancelar]"]       │
│ IncidenteForm (novo/editar): campos com rótulo visível e erro junto ao campo            │
│ Carregando / ErroMensagem (tentar de novo) / lista vazia                                │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### `/como-funciona` (W44) e 404 (W2)

Quatro cartões (medir, decidir, assumir, alertar), tabela dos 5 estados com `LedEstado`, diagrama SVG em uma direção (dispositivo → FIWARE → site, setas só para a direita), links do Wokwi e do Edge, equipe com RMs. 404: "Esta câmara não existe." + link para o início.

## 4. Árvore de componentes e hooks

```
App (router)
├─ ui/        Navbar · Footer · PainelVidro · TituloLed · BotaoLed · BotaoSegurar
│             StatusBadge · Carregando · ErroMensagem
├─ pages/     Inicio · Emulador · SimuladorReal · Incidentes · ComoFunciona · NaoEncontrada
├─ home/      FundoBinario (canvas) · GeladeiraFaiscas (SVG + canvas) · Capitulo
├─ emulador/  MapaCidade · LocalNoMapa · LinhaAtaque · LinhaDados · Central
│             PlacarComparativo · ControlesAtaque
├─ camara/    PainelCamara · Lcd16x2 · LedEstado · Rele · Equipamento (aquecedor,
│             ventoinha de emergência, refrigeração) · GraficoTemperatura
├─ incidentes/ IncidenteForm · IncidenteItem · FiltrosIncidentes
└─ real/      PainelReal · WokwiEmbed

hooks/  useCidadeSimulada · useCShield · useIncidentes · useDispositivoReal
        useCapituloAtual · usePrefereMenosMovimento · useSegurar
domain/ perfis · cshield · fisica · cidade · lcd (textos do painel.h)
services/ mockapi · fiware
api/    estado · historico
```

Reaproveitamento: `LedEstado`, `GraficoTemperatura` e `StatusBadge` servem ao emulador, ao simulador real e ao como-funciona. `BotaoSegurar` + `useSegurar` servem à liberação. `PainelVidro` é a base de todo painel. Os textos do LCD saem de `domain/lcd.js` (porta de `painel.h`), usados por `Lcd16x2`.

Gráfico: SVG próprio em `GraficoTemperatura` (linha + faixa segura sombreada + eixo em Plex Mono), sem biblioteca, para caber no orçamento e no visual. Estados sinalizados também por texto (W49).

## 5. Decisões a confirmar no T5

Ver a tabela de divergências no `tasks.md` (seção "Decisões abertas").
