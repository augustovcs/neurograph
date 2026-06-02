# NeuroGraph

> Documento de conhecimento permanente do projeto. **Sempre consulte este arquivo antes de implementar qualquer coisa.** Ele resume a visão, a stack, o modelo de dados e a arquitetura de pastas. A fonte original das ideias está em `DevUtilities/ARCH.txt`.

## Visão geral

NeuroGraph é uma simulação visual de neurônios. A ideia central: uma tela gera/contém neurônios que respondem a comportamentos de forma **aleatória, com base em estatísticas biológicas**. Neurônios disparam, se conectam, evoluem ou morrem, e tudo é visualizado em tempo real.

O projeto começa **primitivo, sem concorrência**, e evolui em 4 fases até nível sênior (Redis, RabbitMQ, BackgroundService).

## Fases

| Fase | Objetivo | O que entra |
|------|----------|-------------|
| **1 — MVP** | Fazer neurônios dispararem na tela | React + TS + React Flow + Tailwind + shadcn; ASP.NET Core + EF Core + PostgreSQL |
| **2 — Tempo Real** | Disparos refletidos na tela ao vivo | SignalR (Hub, broadcast, WebSockets). Fluxo: Neuron fired → SignalR → React → atualiza tela |
| **3 — Simulação Real** | Engine de simulação | Engine com `Neuron`, `Synapse`, `Network`, `Simulation` |
| **4 — Sênior** | Escala e múltiplas simulações | Redis (estado das simulações), RabbitMQ (múltiplas simulações), `BackgroundService` (simulações independentes) |

> **Estado atual: Fase 1 (MVP).** Não introduzir concorrência, Redis, RabbitMQ ou filas ainda. Manter simples.

## Stack

**Backend** — ASP.NET Core (.NET 8.0), Entity Framework Core, PostgreSQL. SignalR a partir da Fase 2.

**Frontend** — React, TypeScript, React Flow (`@xyflow/react`), Tailwind CSS, shadcn/ui. Cliente SignalR (`@microsoft/signalr`) a partir da Fase 2.

## Arquitetura macro

A arquitetura principal é separada em **4 módulos** ("4 cada"). O primeiro e único em desenvolvimento agora:

### Módulo `Main`
Projeto principal: leitura principal dos neurônios, conexão principal entre eles, e desenvolvimento de **comportamentos randômicos-base** que servem de gatilho para eventos dos serviços de comportamentos avançados (futuros módulos).

Objetivo do Main: construir as 3 telas e visualizar neurônios animados. Erros de dados, estatísticas e eventos são ajustados no final.

> Os outros 3 módulos da arquitetura ainda não foram especificados (espaço reservado em `ARCH.txt`).

## Banco de dados

Ordem de criação das tabelas:

1. `neurons`
2. `neurons_logs`
3. `neural_connections`
4. `biological_signals`
5. `biological_events`

E **3 views**:
- Status de quais neurônios mais duraram / evoluíram
- Quantos morreram e de que formas
- Eventos melhor realizados (morte ou evolução)

Comportamentos são randomizados: uma `%` de ocorrência a cada `x` tempo. O Editor permite **fixar** (pin) essas configurações que por padrão são aleatórias.

## Telas (3–4 principais)

1. **Main** — tela inicial com cards; cada card leva a outra tela.
2. **Statistics** — estatísticas (das views).
3. **Hub** — visualização dos neurônios animados (React Flow).
4. **Editor** — configuração de ocorrência de eventos; permite fixar percentuais/tempos que são randômicos por padrão.

## Arquitetura de pastas

```
NeuroGraph/
├── CLAUDE.md                      # este arquivo
├── README.md
├── .gitignore
├── DevUtilities/
│   └── ARCH.txt                   # fonte original das ideias
├── backend/
│   ├── global.json                # pina o SDK .NET 8
│   ├── NeuroGraph.sln
│   ├── src/
│   │   ├── NeuroGraph.Api/             # Web API, controllers, Program.cs, (Hubs SignalR na Fase 2)
│   │   ├── NeuroGraph.Application/     # casos de uso, DTOs, interfaces de serviço
│   │   ├── NeuroGraph.Domain/          # entidades: Neuron, NeuralConnection, BiologicalSignal, BiologicalEvent, NeuronLog
│   │   └── NeuroGraph.Infrastructure/  # EF Core DbContext, configs, migrations, PostgreSQL
│   └── tests/
│       └── NeuroGraph.Tests/
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── components.json            # config shadcn
    └── src/
        ├── pages/                 # Main, Statistics, Hub, Editor
        ├── components/            # incl. components/ui (shadcn)
        ├── lib/                   # utils, api client, (signalr na Fase 2)
        └── App.tsx                # rotas
```

### Camadas do backend (Clean Architecture leve)

- **Domain** não depende de ninguém. Só entidades e regras.
- **Application** depende de Domain. Define interfaces (repositórios/serviços) e casos de uso.
- **Infrastructure** depende de Application + Domain. Implementa EF Core / PostgreSQL.
- **Api** depende de tudo; só compõe (DI) e expõe HTTP.

Essa separação existe para acomodar as Fases 2–4 (SignalR, Engine, Redis, RabbitMQ) sem reescrever o núcleo.

## Convenções

- Backend em `net8.0` (pinado via `backend/global.json`). Não bumpar para net9/net10.
- Tabelas/colunas em `snake_case` no Postgres; entidades em `PascalCase` no C# (mapeamento na Infrastructure).
- Frontend usa pnpm (não npm/yarn). Path alias `@/` → `src/`.
- Manter Fase 1 sem concorrência. Disparos hoje podem ser polling/random; tempo real fica para Fase 2.

## Comandos

```bash
# Backend
cd backend
dotnet restore
dotnet build
dotnet run --project src/NeuroGraph.Api      # sobe a API
dotnet ef migrations add <Nome> --project src/NeuroGraph.Infrastructure --startup-project src/NeuroGraph.Api
dotnet ef database update --project src/NeuroGraph.Infrastructure --startup-project src/NeuroGraph.Api

# Frontend
cd frontend
pnpm install
pnpm dev
pnpm build
```
