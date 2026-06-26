# TradingStringOperationalPlataform — Design Spec

**Date:** 2026-06-26
**Feature:** New experience card for the "String da Operação" commodities trading operations dashboard

---

## Overview

Add a fifth experience card showcasing the operational analytics dashboard built for the trading platform. It visualises the full commodities operation flow (purchase → invoice → sale → freight → margin) with charts, tables, a Brazil heat map, and tax tracking. Part of the same system as `TradingPlataform`, using ERP integration data. All dashboard values are simulated mock data.

---

## Files

| Action | Path |
|--------|------|
| Create | `src/components/ExperiencesSection/TradingStringOperationalPlataform/index.tsx` |
| Create | `src/components/ExperiencesSection/TradingStringOperationalPlataform/DashboardContent.tsx` |
| Modify | `src/mock/experiences.json` — add `type: "tradingString"` entry |
| Modify | `src/components/ExperiencesSection/index.tsx` — register dynamic import |

---

## Component Structure

```
TradingStringOperationalPlataform/
  index.tsx           ← ExperienceCard (direction="left") + GSAP auto-scroll + ProjectDetailsCard
  DashboardContent.tsx ← all JSX sections, charts, tables, Brazil SVG map
```

`index.tsx` owns `containerRef` and `innerRef`, runs the GSAP tween, and renders `<DashboardContent />` inside the inner div. `DashboardContent` is a pure presentational component (no props, no hooks) — all mock data lives at the top of `DashboardContent.tsx`.

---

## Dashboard Sections (DashboardContent.tsx)

Light theme (`bg-gray-50`, white cards, teal `#0d9488` accent). Scroll content is ~3× the card height.

### 1. Header bar
"String da Operação" in teal bold + three decorative buttons: "Resetar layout", "Sincronizar relatório", "Exportar Excel".

### 2. KPI Cards (2 rows × 3)
| Card | Mock value |
|------|-----------|
| Volume de Entrada | 98.432 ton |
| Volume de Saída | 97.891 ton |
| Valor Entrada | R$ 174.520.000,00 |
| Valor Saída | R$ 198.340.000,00 |
| Margem Bruta | R$ 23.820.000,00 (13,62%) |
| Margem Líquida | R$ 1.540.000,00 (0,88%) |

### 3. Top 10 Bar Charts — 3 columns
Each column has a title, decorative tab buttons (Por margem / Por volume / Maior margem / Menor margem), and a `BarChart` with 5 abbreviated bars.

- **Top 10 Fornecedores** — 5 fictitious suppliers, values in R$ thousands
- **Top 10 Clientes** — 5 fictitious clients, values in R$ thousands
- **Top 10 Transportadoras** — 5 fictitious carriers, freight rate values

All bar charts use teal (`#0d9488`) with gradient tints for lower bars.

### 4. Two-panel row
**Left — Comissões por Corretor** (table): 5 fictitious broker names + commission values.
**Right — Evolução Margem Bruta x Margem Líquida** (`LineChart`): 20 daily data points (02/02 → 25/06), two lines — Margem Bruta (teal) and Margem Líquida (light teal). Includes negative dip around mid-April.

### 5. Two-panel row
**Left — Composição de Custos** (`PieChart` donut): 4 slices — Frete, Impostos, Comissões, Financeiro — with legend showing percentages.
**Right — Mapa de Calor** (inline SVG): Simplified Brazil outline (path) with 4 `radialGradient` heat circles at key agricultural regions: Central-Oeste (Goiás/Mato Grosso), Sudeste (Triângulo Mineiro), Sul (Paraná), Norte (Pará). Label "Mapa de Calor" + tab buttons (Margem Líquida / Margem Bruta / Operações — decorative).

### 6. Impostos — Crédito x Débito
Table with 8 tax types (ICMS, PIS, COFINS, PIS/COFINS FRETE, FUNRURAL, SENAR, IPI, RAT), fictitious Crédito / Débito / Saldo columns. Negative saldos in red, positive in teal. Total row in bold.
Below the table: a `BarChart` with grouped bars (Crédito teal, Débito red) for each tax type.

### 7. Top 10 Produtos
Single `BarChart` (horizontal orientation optional, or vertical) with 8 fictitious agricultural products (Soja, Milho, Sorgo, Farelo de Soja, etc.) and their net margin values.

### 8. Notas Fiscais
Table with columns: ESTAB, PRODUTO, FORNECEDOR, CLIENTE, QTD ENTRADA, QTD SAÍDA, VLR ENTRADA, VLR SAÍDA.
6 fictitious rows. Decorative pagination: `< 1  2  ...  29 >`.

---

## Auto-scroll (index.tsx)

```
containerRef → overflow:hidden wrapper (absolute inset-0, card height)
innerRef     → DashboardContent wrapper (no height constraint)

useEffect:
  distance = inner.scrollHeight - container.clientHeight
  tween = gsap.to(inner, {
    y: -distance,
    duration: 25,
    ease: "none",
    repeat: -1,
    yoyo: true,
    repeatDelay: 1,
  })
  mouseenter → pause, mouseleave → resume
  cleanup: tween.kill() + remove listeners
```

---

## experiences.json Entry

```json
{
  "type": "tradingString",
  "title": "Dashboard operacional de string de commodities",
  "description": "Painel analítico do fluxo completo de operações de compra e venda de commodities, com visibilidade de margens, impostos, fretes e comissões via integração com ERP.",
  "achievements": [
    {
      "title": "Visão de Margens",
      "description": "Acompanhamento em tempo real da margem bruta e líquida por período, com drill-down por produto, cliente e fornecedor."
    },
    {
      "title": "Top Parceiros",
      "description": "Ranking dos top 10 clientes, fornecedores e transportadoras por margem e volume negociado."
    },
    {
      "title": "Mapa Operacional",
      "description": "Mapa de calor nacional identificando a concentração de operações e margens por região geográfica."
    },
    {
      "title": "Gestão de Impostos",
      "description": "Controle detalhado de crédito e débito por imposto (ICMS, PIS, COFINS, FUNRURAL etc.) gerado em cada operação."
    }
  ],
  "techStack": [
    { "name": "React",       "icon": "SiReact" },
    { "name": "Tailwind CSS","icon": "SiTailwindcss" },
    { "name": "Next.js",     "icon": "SiNextdotjs" },
    { "name": "TypeScript",  "icon": "SiTypescript" },
    { "name": "OpenAI",      "icon": "SiOpenai" },
    { "name": "N8N",         "icon": "SiN8N" },
    { "name": "MongoDB",     "icon": "SiMongodb" },
    { "name": "Claude",      "icon": "SiClaude" },
    { "name": "Node.js",     "icon": "FaNodeJs" },
    { "name": "RabbitMQ",    "icon": "SiRabbitmq" },
    { "name": "AWS",         "icon": "FaAws" }
  ]
}
```

---

## ExperiencesSection Registration

```tsx
const TradingStringOperationalPlataform = dynamic(
  () => import('./TradingStringOperationalPlataform').then(mod => mod.TradingStringOperationalPlataform),
  { ssr: false, loading: SlidePlaceholder }
)

const slides = [
  { id: 'consultancy',    component: ConsultancyPlataform },
  { id: 'geomap',         component: GeoMapPlataform },
  { id: 'trading',        component: TradingPlataform },
  { id: 'investor',       component: InvestorPlataform },
  { id: 'tradingString',  component: TradingStringOperationalPlataform },
]
```

---

## Constraints

- `'use client'` on `index.tsx` (uses refs/effects); `DashboardContent.tsx` needs no directive (pure JSX).
- All data in `DashboardContent.tsx` is hardcoded mock — no data from the screenshots.
- No external map library — Brazil SVG inline only.
- Recharts already installed. No new packages.
- Card direction: `"left"` (5th entry, odd CSS position).
- Light theme (white/gray-50) for visual contrast with dark portfolio background.
