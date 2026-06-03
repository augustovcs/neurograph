<div align="center">

# 🧠 NeuroGraph

### Um organismo neural vivo na tela — neurônios que disparam, se conectam, evoluem e morrem com base em estatísticas biológicas.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/fase-1%20·%20MVP-8b5cf6)](#-fases-do-projeto)

</div>

---

## 📖 Sobre o projeto

**NeuroGraph** é uma simulação visual e interativa de uma rede neural **biológica** (não uma rede neural artificial de machine learning). A ideia central é simples e poderosa:

> Uma tela contém neurônios que **respondem a comportamentos de forma aleatória, com base em estatísticas biológicas**. Eles disparam, formam sinapses, evoluem para novas gerações ou morrem — e tudo isso é visualizado em tempo real.

O projeto nasce **primitivo e sem concorrência**, focado em fazer "os neurônios dispararem na tela", e cresce em **4 fases** até um patamar sênior com filas, cache distribuído e simulações independentes rodando em segundo plano.

A motivação é dupla:
- 🎓 **Educacional / de engenharia** — evoluir uma base de código de um MVP simples até uma arquitetura distribuída, aprendendo WebSockets, engines de simulação, mensageria e estado distribuído no caminho.
- 🔬 **Científica** — modelar comportamentos neurais (disparo, limiar de membrana, período refratário, evolução, poda sináptica) a partir de parâmetros estatísticos plausíveis.

---

## 👥 Equipe

| Integrante | Papel | Responsabilidades |
|------------|-------|-------------------|
| **Augusto Berriel** | 🧑‍✈️ Dev Chefe / Tech Lead | Arquitetura, definição das fases, backend .NET, padrões de código e direção técnica geral |
| **Keven Lima** | 🧑‍💻 Dev Fullstack | Implementação backend + frontend, integração da API, telas e componentes |
| **Evelyn Eberhardt** | 🔬 Pesquisadora — Neurociência | Modelagem biológica, definição de parâmetros estatísticos, validação dos comportamentos neurais |

---

## 🗺️ Fases do projeto

| Fase | Objetivo | O que entra |
|:----:|----------|-------------|
| **1 — MVP** | Fazer neurônios dispararem na tela | React + TS + React Flow + Tailwind · ASP.NET Core + EF Core + PostgreSQL |
| **2 — Tempo Real** | Disparos refletidos na tela ao vivo | **SignalR** (Hub, broadcast, WebSockets) → `Neuron fired → SignalR → React → atualiza a tela` |
| **3 — Simulação Real** | Engine de simulação própria | Engine com `Neuron`, `Synapse`, `Network`, `Simulation` |
| **4 — Sênior** | Escala e múltiplas simulações | **Redis** (estado), **RabbitMQ** (múltiplas simulações), **`BackgroundService`** (simulações independentes) |

> **📍 Estado atual: Fase 1 (MVP).** Sem concorrência, sem Redis/RabbitMQ ainda. O frontend já possui as 4 telas funcionando com **dados mock**; o backend está inicializado e pronto para receber o modelo de dados.

---

## 🏛️ Arquitetura

A arquitetura macro é dividida em **4 módulos**. O primeiro — e único em desenvolvimento agora — é o módulo **Main**:

> **Módulo Main:** projeto principal onde acontece a leitura dos neurônios, a conexão entre eles e o desenvolvimento dos **comportamentos randômicos-base**, que servem de gatilho para os eventos dos serviços de comportamento avançados (módulos futuros). O objetivo do Main é construir as telas e visualizar os neurônios animados — erros de dados, estatísticas e eventos são refinados ao final.

```
┌─────────────┐      HTTP / (SignalR na Fase 2)      ┌──────────────────────┐
│     Web      │ ───────────────────────────────────▶ │   Core/NeuroGraph.Main │
│ React + Vite │ ◀─────────────────────────────────── │     ASP.NET Core 8     │
└─────────────┘                                        └───────────┬──────────┘
                                                                    │ EF Core
                                                                    ▼
                                                            ┌───────────────┐
                                                            │  PostgreSQL   │
                                                            └───────────────┘
```

> 💡 Hoje o módulo principal vive como **um único projeto** em `Core/NeuroGraph.Main`. Futuramente ele será separado em múltiplos `.csproj` (camadas Domain / Application / Infrastructure / Api) conforme as Fases 3 e 4 exigirem.

---

## 🧰 Stack tecnológica

### Backend — `Core/`
| Tecnologia | Uso |
|------------|-----|
| **.NET 8.0** / ASP.NET Core | API HTTP do módulo principal |
| **Entity Framework Core** | ORM / acesso a dados |
| **PostgreSQL** | Banco de dados relacional |
| *SignalR* | Tempo real (Fase 2) |
| *Redis · RabbitMQ* | Estado e mensageria (Fase 4) |

### Frontend — `Web/`
| Tecnologia | Uso |
|------------|-----|
| **React 19 + TypeScript** | UI |
| **Vite** | Bundler / dev server |
| **Tailwind CSS v4** | Estilo (tema escuro neon, tokens de design) |
| **React Flow** (`@xyflow/react`) | Visualização do grafo neural (Hub) |
| **React Router** | Navegação entre telas |
| **lucide-react** | Ícones |

---

## 📂 Estrutura de pastas

```
NeuroGraph/
├── Core/                          # Backend .NET 8
│   └── NeuroGraph.Main/           # Módulo principal (1 projeto por enquanto)
│       ├── Controllers/
│       ├── Program.cs
│       └── appsettings.json
├── Web/                           # Frontend React + Vite
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── layout/            # Sidebar, AppLayout
│       │   └── ui/                # Panel, StatCard, Badge, ProgressBar, Slider
│       ├── features/
│       │   └── hub/               # NeuronNode + grafo (React Flow)
│       ├── lib/                   # cn(), tipos compartilhados
│       ├── mocks/                 # dados mock (data.ts)
│       ├── pages/                 # Main, Hub, Editor, Statistics
│       ├── App.tsx                # rotas
│       └── index.css              # tema / tokens Tailwind v4
├── DevUtilities/
│   └── ARCH.txt                   # documento-fonte das ideias
├── .gitignore
└── README.md
```

---

## 🖥️ Telas

O frontend possui **4 telas principais**, todas já navegáveis com dados mock:

| Tela | Rota | Descrição |
|------|------|-----------|
| **Main** | `/` | Dashboard de boas-vindas: cartões de métricas, navegação rápida, atividade dos neurônios em tempo real e eventos recentes |
| **Hub** | `/hub` | O "Mundo Neural" — grafo interativo (React Flow) com neurônios coloridos por tipo, conexões animadas, zoom, minimapa e legenda. Neurônios que disparam **pulsam** |
| **Editor** | `/editor` | Configurações da simulação: sliders de probabilidade/tempo, presets (Calmo / Equilibrado / Caótico) e a opção de **fixar** (📌) parâmetros que, por padrão, são randomizados a cada ciclo |
| **Estatísticas** | `/statistics` | Quem mais durou, quem mais evoluiu, causas de morte e os eventos de melhor resultado |

---

## 🗄️ Modelo de dados (planejado)

Ordem de criação das tabelas no PostgreSQL:

| # | Tabela | Conteúdo |
|:-:|--------|----------|
| 1 | `neurons` | Neurônios: rótulo, status, potencial de membrana, limiar, geração, posição (x,y) |
| 2 | `neurons_logs` | Histórico de mudanças de estado de cada neurônio |
| 3 | `neural_connections` | Sinapses direcionadas (origem → destino, peso) |
| 4 | `biological_signals` | Sinais que trafegam entre neurônios (excitatório / inibitório / modulador) |
| 5 | `biological_events` | Eventos gerados por comportamento randômico (disparo, conexão, evolução, morte) |

**3 views** complementares:
- 📈 Neurônios que mais **duraram / evoluíram**
- 💀 Quantos **morreram** e de que formas
- 🏆 **Eventos melhor realizados** (morte ou evolução de maior qualidade)

> Os comportamentos são randomizados — uma `%` de ocorrência a cada `x` tempo —, e o **Editor** permite fixar esses valores.

---

## 🚀 Como rodar

### Pré-requisitos
- [.NET SDK 8.0](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) e [pnpm](https://pnpm.io/) (`corepack enable pnpm` ou `npm i -g pnpm`)
- [PostgreSQL 16](https://www.postgresql.org/) (para quando o backend ganhar persistência)

### Backend — `Core/NeuroGraph.Main`
```bash
cd Core/NeuroGraph.Main
dotnet restore
dotnet run
# API disponível em https://localhost:5xxx (veja o console / launchSettings.json)
```

### Frontend — `Web`
```bash
cd Web
pnpm install
pnpm dev
# App disponível em http://localhost:5173
```

---

## 📜 Scripts úteis

**Frontend (`Web/`)**
| Comando | Ação |
|---------|------|
| `pnpm dev` | Servidor de desenvolvimento (HMR) |
| `pnpm build` | Type-check + build de produção |
| `pnpm preview` | Pré-visualiza o build |
| `pnpm lint` | ESLint |

**Backend (`Core/NeuroGraph.Main/`)**
| Comando | Ação |
|---------|------|
| `dotnet run` | Sobe a API |
| `dotnet build` | Compila o projeto |

---

## 🛣️ Roadmap

- [x] **Fase 1** — Scaffold do backend (.NET 8) e frontend (Vite/React)
- [x] **Fase 1** — 4 telas do frontend com dados mock
- [ ] **Fase 1** — Modelo de dados (EF Core) + migrations + endpoints reais
- [ ] **Fase 2** — SignalR: disparos em tempo real na tela
- [ ] **Fase 3** — Engine de simulação (`Neuron`, `Synapse`, `Network`, `Simulation`)
- [ ] **Fase 4** — Redis + RabbitMQ + `BackgroundService` para múltiplas simulações

---

## 🤝 Convenções

- Backend fixado em **`net8.0`** (não bumpar para versões maiores).
- Tabelas/colunas em `snake_case` no Postgres; entidades em `PascalCase` no C#.
- Frontend usa **pnpm** (não npm/yarn); alias de import `@/` → `src/`.
- Fase 1 permanece **sem concorrência** — tempo real só na Fase 2.

---

<div align="center">

Feito com 🧠 por **Augusto Berriel**, **Keven Lima** e **Evelyn Eberhardt**.

</div>
