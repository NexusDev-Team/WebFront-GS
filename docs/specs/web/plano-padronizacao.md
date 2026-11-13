# Plano — Padronização visual do site inteiro (design da página inicial em todas as abas)

Pedido do usuário (13/11/2026): o design da página inicial ficou aprovado, mas as outras abas
ainda usam o padrão antigo. Deixar o site inteiro no mesmo design, harmônico. Ajustes pontuais:
Notícias (manchete sem imagem e nova ordem) e Nexus Dev (lista da equipe igual à da página
inicial e página reorganizada).

Executor: Sonnet, um passo por vez, um commit por passo (Conventional Commits em português,
sem `Co-Authored-By`, sem push).

## 1. Contexto

A página inicial (`src/pages/Inicio.jsx`) segue o Design System v1.0 "Cyber-criogênico":

- **Hero** (`components/inicio/Banner.jsx`): rótulo técnico com fio degradê, título grande em
  duas linhas (a segunda em `.titulo-ciano`), entrada escalonada com `framer-motion`.
- **Seções** (`components/ui/Secao.jsx`): respiro de 96 a 160 px, rótulo técnico, título de 30 a
  48 px, subtítulo, tudo entrando com `Revelar` ao rolar.
- **Ritmo de faixas**: seções alternam fundo liso e faixa `border-y border-borda/50 bg-noite-900/60`;
  seções de destaque levam `FundoCyber` atrás.
- **Pouco cartão**: números e listas "respiram" com fios finos (`FatoNumero`, lista da equipe);
  `.cartao` (PainelVidro) só onde agrupa de verdade.
- **Link com seta** (`ArrowRight` deslizando no hover), em ciano.

As páginas internas ainda usam o padrão anterior, e por isso destoam:

| Página | Como está hoje |
|---|---|
| Como funciona | `header` próprio com `TituloLed`; seções com `TituloSecao` e `py-16 sm:py-24`; sem `Revelar`; link final em `text-led-forte` sem seta |
| Emulador | `Pagina` + `TituloLed`; "Dispositivo real" é um `PainelVidro` gigante com `TituloLed` |
| Notícias | `Pagina` com `gap-12`; todas as seções com `TituloLed nivel 2`; manchete com `IlustracaoGeladeira`; "Mais notícias" logo depois da manchete |
| Nexus Dev | `Pagina`; integrantes em cartões com foto (`CartaoIntegrante`), diferente da lista da página inicial |
| 404 | `Pagina` + `TituloLed` |

O padrão do link com seta está copiado em `SecaoProblema`, `SecaoSolucao` e `SecaoNexusDev`
(três cópias): pela regra de reaproveitamento, extrair antes de usar uma quarta vez.

Depois deste plano: Fase D/E seguem com o site já padronizado; conferência visual no fim.

## 2. Objetivo

Todas as rotas (`/`, `/como-funciona`, `/emulador`, `/noticias`, `/nexus-dev` e 404) abrem com o
mesmo cabeçalho no estilo do hero e são feitas só de `Secao` (rótulo técnico, título, subtítulo,
`Revelar`, ritmo de faixas), sem `Pagina`, `TituloSecao` nem `TituloLed nivel={2}` nas páginas;
Notícias fica na ordem manchete (sem imagem) → linha do tempo → "E na sua cidade?" + chamada →
mais notícias; Nexus Dev usa a lista da equipe da página inicial.

## 3. Detalhes técnicos

### 3.1 Peças compartilhadas novas (`src/components/ui/`)

**`movimento.js`** — variantes da entrada escalonada, tiradas do `Banner.jsx` (hoje locais nele):

```js
export const ENTRADA_CONTAINER = { hidden: {}, visivel: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }
export const ENTRADA_ITEM = {
  hidden: { opacity: 0, y: 24 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}
```

`Banner.jsx` passa a importar daqui (comportamento igual). Com `prefers-reduced-motion`, seguir
o que o `Revelar` já faz (conferir `Revelar.jsx` e copiar o mesmo critério: sem deslocamento).

**`CabecalhoPagina.jsx`** — o "hero" das páginas internas, menor que o da inicial (sem imagem):

```jsx
<CabecalhoPagina
  id="titulo-pagina"          // id do h1 (aria-labelledby da <section>)
  rotulo="Como funciona"      // rótulo técnico com o fio degradê, igual ao Banner
  titulo="Vê de longe."       // 1ª linha, gelo-50
  destaque="Só obedece de perto." // 2ª linha opcional, .titulo-ciano
  subtitulo="..."             // opcional, text-lg sm:text-xl text-gelo-100, max-w-xl
  variante="repouso"          // repouso | ataque (emulador: led-falha text-critico no título inteiro)
  fundo                       // boolean, padrão true: FundoCyber atrás
>
  {children /* ações opcionais: botões, etiqueta "1 s = 1 min" */}
</CabecalhoPagina>
```

- `<section aria-labelledby={id} className="relative overflow-hidden border-b border-borda/50 pt-20 pb-16 md:pt-28 md:pb-24">`
- Dentro: `conteudo relative`, `motion.div` com `ENTRADA_CONTAINER`, cada bloco `motion.*` com `ENTRADA_ITEM`.
- `h1`: `text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.08] font-bold tracking-tight`.
- Quando `variante="ataque"`, a 2ª linha não usa `.titulo-ciano` (vermelho é só ataque); o h1
  inteiro recebe `led-falha text-critico`, como o `TituloLed` faz hoje.

**`LinkSeta.jsx`** — o link "texto + ArrowRight" das seções da página inicial:

```jsx
<LinkSeta to="/como-funciona" className="mt-12">Ver como funciona</LinkSeta>
```

Mesmas classes de hoje (`group inline-flex min-h-11 items-center gap-2 font-semibold text-ciano
underline-offset-4 hover:underline` + seta com `motion-safe:group-hover:translate-x-1`).
Substitui as três cópias em `SecaoProblema`, `SecaoSolucao`, `SecaoNexusDev`.

**`Secao.jsx`** — ganha duas props, sem mudar o comportamento padrão:

- `faixa` (boolean): aplica `border-y border-borda/50 bg-noite-900/60` (o ritmo de faixas).
  `SecaoSolucao` e `SecaoNexusDev` passam a usar `faixa` em vez da className repetida.
- `compacta` (boolean): respiro `py-16 md:py-24` em vez de `py-24 md:py-32 lg:py-40`. Só para o
  jogo do emulador, que precisa caber na tela.

**`ListaEquipe.jsx`** (`src/components/equipe/`) — a lista que hoje está dentro de
`SecaoNexusDev` (avatar com iniciais, nome, RM, fios finos). Prop `comFuncao` (boolean): quando
verdadeira, mostra `pessoa.funcao` em `text-sm text-gelo-300` abaixo do nome (a página Nexus Dev
usa; a inicial não). `SecaoNexusDev` passa a usar este componente.

### 3.2 Páginas

**Ritmo por página** (L = liso, F = faixa, C = com `FundoCyber`):

- `/como-funciona`: Cabeçalho → Ciclo (L) → Arquitetura (F) → Estados (L, C) → Wokwi (F) → Origem (L).
- `/emulador`: Cabeçalho (com ações) → Jogo (`Secao compacta`, sem título, `aria-label`) →
  Dispositivo real (F).
- `/noticias`: Cabeçalho → Manchete (L) → Como tudo aconteceu (F) → E na sua cidade? (L, C) com a
  chamada logo abaixo dentro da mesma seção → Mais notícias (F).
- `/nexus-dev`: Cabeçalho → Integrantes + tecnologias (L) → Nossa visão (F) → Nossa cultura (L, C)
  → Sobre a GS 2026.2 (F).
- 404: só `CabecalhoPagina` (com `min-h-[60vh]` via className) e o botão "Voltar ao início".

**Como funciona** — `SecaoCiclo`, `SecaoArquitetura`, `SecaoEstados`, `SecaoWokwi`,
`SecaoOrigem` trocam o `<section>` + `TituloSecao` por `Secao` (`id`, `ancora={conteudo.id}`,
`rotulo`, `titulo`, `subtitulo`). Rótulos técnicos novos, em `content/comoFunciona.js`:
"O ciclo", "Arquitetura", "Estados", "Simulador", "Origem". Grades de cartões entram com
`Revelar` (atraso `indice * 0.08`). Link final de `SecaoOrigem` vira `LinkSeta`. O `CABECALHO`
do conteúdo ganha `destaque` opcional (o texto fica a cargo do executor só se já existir uma
frase pronta no conteúdo; senão, sem `destaque`).

**Emulador** — o `header` vira `CabecalhoPagina` com `variante` vindo de `algumSobAtaque`,
rótulo "Simulador", título "Seja o hacker", subtítulo atual e, como `children`, a etiqueta
"Tempo acelerado" e o botão "Ver o dispositivo real". O grid do jogo fica igual (não mexer na
altura fixa de 679 px nem nos componentes do jogo), só envolto em `Secao compacta`.
`SecaoDispositivoReal` vira `Secao faixa` (`ancora="dispositivo-real"`, rótulo "Dispositivo
real", título "Como ele é de verdade" — ou manter "Dispositivo real" como título se preferir
não inventar texto —, subtítulo = os dois parágrafos atuais juntos). A imagem e o Wokwi ficam em
`grid lg:grid-cols-2`, cada um num `Revelar`. O `scroll-mt` já vem do `Secao`.

**Notícias** — nova ordem e manchete sem imagem:

1. `CabecalhoPagina` (rótulo "Notícias", título "Por que o C-Shield existe", subtítulo atual).
2. Manchete: `ManchetePrincipal` perde a `IlustracaoGeladeira` e o grid de duas colunas; vira
   texto largo (chapéu mono, manchete `text-[clamp(2rem,4vw,3.25rem)]`, resumo `text-lg`, botão).
   Fica numa `Secao` sem título visível (o `h2 sr-only` "Manchete do dia" continua). Pode
   continuar no `PainelVidro` ou virar bloco com fio no topo como o `FatoNumero` — usar o fio
   (menos cartão, igual à inicial).
3. "Como tudo aconteceu" (`Secao faixa`, rótulo "Linha do tempo") com `LinhaDoTempo`.
4. "E na sua cidade?" — `SecaoSuaCidade` passa a renderizar `Secao` (rótulo "Cadastro do
   bairro", título e subtítulo atuais, `fundo={<FundoCyber />}`); o miolo (botão, filtro,
   formulário, estados, lista) fica igual. A chamada "Os monitores avisam. O C-Shield avisa e
   age." vem **logo abaixo, dentro da mesma seção**, num `PainelVidro` (`mt-16`), com título `h3`
   no estilo de título de seção e o `BotaoLed` "Ataque uma cidade".
5. "Mais notícias" (`Secao faixa`, rótulo "Mais notícias", título "Outras matérias do caso") com a
   grade de `CartaoNoticia` (cada um num `Revelar`) e a nota sobre "Título da equipe". **Última
   seção da página.**

`IlustracaoGeladeira.jsx` fica sem uso: apagar o arquivo (conferir com `grep` antes).

**Nexus Dev** — reorganizada:

1. `CabecalhoPagina` (rótulo "A equipe", título "Nexus Dev", destaque "Quem constrói o C-Shield",
   subtítulo atual).
2. Integrantes (`Secao`, rótulo "Integrantes", título "Quem faz o C-Shield"): grid
   `lg:grid-cols-2` igual ao `SecaoNexusDev` — à esquerda as tecnologias (`NEXUS.tecnologias`
   de `content/inicio.js`, mesma fonte) e um parágrafo curto; à direita `ListaEquipe comFuncao`.
3. Nossa visão (`Secao faixa`, rótulo "Visão"): a frase em `text-[clamp(1.5rem,2.6vw,2.25rem)]
   leading-snug text-gelo-50`, sem cartão, com um fio ciano à esquerda (`border-l-2 border-ciano pl-6`).
4. Nossa cultura (`Secao`, rótulo "Cultura", `FundoCyber`): lista numerada `01`…`05` com fios
   finos (mesmo modelo da lista da equipe: `divide-y border-y border-borda`, número mono
   `text-gelo-azul`, título e texto), sem cartões.
5. Sobre a GS 2026.2 (`Secao faixa`, rótulo "Global Solution"): os parágrafos atuais em
   `max-w-prose`, e no fim `LinkSeta` para `/como-funciona`.

`CartaoIntegrante.jsx` fica sem uso: apagar (conferir com `grep`). As fotos em `public/equipe/`
deixam de aparecer; o campo `foto` de `equipe.js` permanece (teste e possível uso futuro).

### 3.3 Limpeza ao final

- Apagar `components/ui/Pagina.jsx` e `components/ui/TituloSecao.jsx` quando nenhum arquivo os
  importar.
- `TituloLed` fica só se ainda tiver uso (por exemplo dentro de `CabecalhoPagina`); senão apagar.
- `Rotulo.jsx` idem (o cabeçalho usa a classe `rotulo-tecnico` direto).
- Atualizar os comentários de topo dos arquivos tocados (ordem das seções mudou).
- `docs/specs/web/design.md`: registrar o padrão (cabeçalho de página, `Secao faixa/compacta`,
  `LinkSeta`, ritmo L/F por página).

### 3.4 O que não muda

Lógica do jogo, hooks, `src/domain`, serviços, textos dos testes de conteúdo (`tests/*.test.js`),
altura fixa dos cards do emulador, princípio de não enviar ordens ao C-Shield.

## 4. Ferramentas e requisitos

- Nenhuma dependência nova (`framer-motion` e `lucide-react` já liberados e instalados).
- `npm run dev` para olhar; Playwright MCP para capturas 390 px e 1440 px (nesta sessão o MCP
  falhou ao conectar; se continuar, conferir à mão no navegador nas duas larguras).
- Skills a ativar na execução: `frontend-design` / `design-taste-frontend` (consistência),
  `accessibility` (cabeçalhos, landmarks, foco), `verification-before-completion`.

## 5. Passos (um commit por passo)

1. Criar `ui/movimento.js` e fazer o `Banner` importar dele. Verificar: home igual.
   `refactor(ui): extrai as variantes de entrada do hero`
2. Criar `ui/LinkSeta.jsx` e trocar as três cópias (mudança mecânica idêntica).
   `refactor(ui): extrai o link com seta das secoes da inicial`
3. Adicionar `faixa` e `compacta` ao `Secao`; `SecaoSolucao` e `SecaoNexusDev` usam `faixa`.
   `refactor(ui): adiciona faixa e compacta ao componente Secao`
4. Criar `ui/CabecalhoPagina.jsx`; usar primeiro na 404 (página mais simples).
   `feat(ui): cria o cabecalho de pagina no estilo do hero`
5. Como funciona: cabeçalho + rótulos novos no conteúdo.
   `style(como-funciona): usa o cabecalho de pagina`
6. Como funciona: as cinco seções viram `Secao` com `Revelar` e o ritmo L/F (mudança mecânica
   nos cinco arquivos `comoFunciona/Secao*.jsx`).
   `style(como-funciona): padroniza as secoes com o componente Secao`
7. Emulador: cabeçalho + jogo em `Secao compacta`. Conferir que a altura dos cards continua 679 px.
   `style(emulador): usa o cabecalho de pagina e a secao compacta`
8. Emulador: `SecaoDispositivoReal` vira `Secao faixa`; `/emulador#dispositivo-real` ainda rola até lá.
   `style(emulador): padroniza a secao do dispositivo real`
9. Notícias: `ManchetePrincipal` sem imagem; apagar `IlustracaoGeladeira.jsx`.
   `style(noticias): tira a ilustracao da manchete`
10. Notícias: `SecaoSuaCidade` vira `Secao` e recebe a chamada embaixo (sai da página).
    `style(noticias): padroniza o cadastro e junta a chamada a ele`
11. Notícias: página com cabeçalho e nova ordem (manchete → linha do tempo → sua cidade → mais notícias).
    `feat(noticias): reordena a pagina e deixa mais noticias no fim`
12. Criar `equipe/ListaEquipe.jsx` (com `comFuncao`) e usar no `SecaoNexusDev`.
    `refactor(equipe): extrai a lista da equipe da pagina inicial`
13. Nexus Dev: página reorganizada (cabeçalho, integrantes + tecnologias, visão, cultura, GS);
    apagar `CartaoIntegrante.jsx`.
    `feat(nexus-dev): reorganiza a pagina com o modelo da equipe da inicial`
14. Limpeza: apagar `Pagina`, `TituloSecao` e o que ficou sem uso (`TituloLed`, `Rotulo`);
    atualizar comentários.
    `refactor(ui): remove os componentes de pagina antigos`
15. `design.md`: registrar o padrão.
    `docs(design): registra o padrao de paginas internas`
16. Verificação completa (seção 6) e capturas; corrigir só o que a conferência apontar, cada
    correção no seu commit `fix:` ou `style:`.

Se aparecer decisão fora do plano (por exemplo texto novo de título que não existe no conteúdo),
parar e devolver para planejamento.

## 6. Como verificar

```bash
npx vitest run           # todos os testes passam (364 hoje)
npm run build            # sem erros
npm run lint             # limpo
grep -rniE "/cmd|commands|setLimits|set_limits|fiware_host" src/   # vazio
grep -rnE "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" src/ || echo "sem IP no código"
grep -rnE "Pagina|TituloSecao|IlustracaoGeladeira|CartaoIntegrante" src/   # vazio
grep -rn "TituloLed nivel={2}" src/pages src/components   # vazio
```

No navegador, em 390 px e 1440 px:

- Cada rota abre com o cabeçalho no estilo do hero (rótulo com fio, título grande, entrada
  escalonada) e as seções alternam fundo liso e faixa; nenhuma rolagem horizontal.
- `/noticias`: manchete sem imagem; ordem manchete → "Como tudo aconteceu" → "E na sua cidade?" →
  card "Os monitores avisam..." → "Mais notícias" por último. CRUD continua funcionando
  (cadastrar, filtrar, editar, excluir).
- `/nexus-dev`: integrantes na mesma lista da página inicial (iniciais, nome, função, RM);
  visão, cultura e GS em seções.
- `/emulador`: título fica vermelho durante ataque; cards com 679 px; link "Ver o dispositivo
  real" rola até a seção; `/simulador-real` redireciona para ela.
- Com `prefers-reduced-motion`, nada se desloca nem anima; foco visível em todos os links e
  botões; um `h1` por página, títulos em ordem.
