# InvestorPlataform — Design Spec

**Date:** 2026-06-26  
**Feature:** New experience entry for Bioma Investimentos investor dashboard

---

## Overview

Add a fourth experience card to the `ExperiencesSection` showcasing the investor reporting dashboard built for Bioma Investimentos. The card visually demos the real dashboard UI with a GSAP-powered auto-scroll animation that lets the user see all sections without manual interaction.

---

## Files

| Action | Path |
|--------|------|
| Create | `src/components/ExperiencesSection/InvestorPlataform/index.tsx` |
| Modify | `src/mock/experiences.json` — add `type: "investor"` entry |
| Modify | `src/components/ExperiencesSection/index.tsx` — register dynamic import |
| Verify | `src/components/ExperiencesSection/iconMap.tsx` — add any missing icons |

---

## Component Structure

```
InvestorPlataform/
  index.tsx   ← ExperienceCard (direction="right") + ProjectDetailsCard
```

The `ExperienceCard` wraps the dashboard demo with the standard SVG clip-path frame. `ProjectDetailsCard` sits alongside it with project metadata.

---

## Dashboard Demo Content

The inner container renders a faithful mock of the real dashboard in a **light theme** (white/gray-50 background, teal accent `#0d9488`). Sections in order:

### 1. Header
Bold teal title: `"Relatório - ANTECIPE CONSULTORIA EM CRÉDITO E COBRANÇA LTDA"`

### 2. Summary Cards (2 rows × 4 cards)
Each card: bordered box, label in gray, value in bold.

| Card | Value |
|------|-------|
| Investimento Inicial | R$ 345.000,00 |
| Tempo do Investimento | 57 meses |
| Vr. Bruto Atual | R$ 430.701,09 |
| Juros Ac. | R$ 85.701,09 |
| CDI Período | 74,96% |
| %CDI | 33,14% |
| Rent. Bruta | 24,84% |
| Rent. Anualizada | 4,78% |

### 3. Footnotes
Three numbered notes (values brutos, definição de rentabilidade bruta, definição de rentabilidade anualizada).

### 4. Line Chart — Recharts `LineChart`
Title: `"Rentabilidade ao mês comparada ao CDI (últimos 12 meses)"`  
- **CDI Período** line: yellow/orange (`#f59e0b`)  
- **Rent. Bioma (%a.m)** line: teal (`#0d9488`)  
- Custom tooltip showing Rentabilidade Bioma, CDI, and Diferença  
- 12 months of mock data (2025-07 → 2026-06) matching the screenshot values  
- Data labels on each point

### 5. Portfólio de Debêntures Ativas
Table with columns: Data de Compra, Série, Indexador, Tipo, PU Compra, Qtde Compra, Valor de Compra, PU Atual, Qtde Atual, Valor Atual, Rent.  
3 rows of mock data from the screenshot.

### 6. Debêntures Resgatadas
Table with columns: Data Resgate, Valor Compra, Valor Bruto Resgatado, IR (%), IOF (R$), Valor Líquido  
Decorative pagination indicator: `< 1 - 10 de 25 >`  
2 visible rows.

### 7. Histórico da carteira nos últimos 12 meses
Table with columns: Mês, Saldo Inicial (R$), Investimento (R$), Resgate (R$), Saldo Final Bruto (R$), Rend. Bruto Mensal (R$)  
4 rows visible (2025-07 → 2025-10).

---

## Auto-Scroll Animation

```
containerRef → the overflow:hidden wrapper (height = card height)
innerRef     → the tall dashboard content div

useEffect:
  distance = inner.scrollHeight - container.clientHeight
  tween = gsap.to(innerRef.current, {
    y: -distance,
    duration: 18,
    ease: "none",
    repeat: -1,
    yoyo: true,
    repeatDelay: 1,
  })

  container.addEventListener("mouseenter", () => tween.pause())
  container.addEventListener("mouseleave", () => tween.resume())

  cleanup: tween.kill()
```

The 18s duration + yoyo creates a smooth, slow read through all sections. Hover pauses so users can inspect a section.

---

## experiences.json Entry

```json
{
  "type": "investor",
  "title": "Painel de relatórios para investidores",
  "description": "Plataforma de acompanhamento de investimentos em debêntures para investidores da Bioma Investimentos, com relatórios detalhados de rentabilidade, comparativo com CDI e histórico de resgates.",
  "achievements": [
    {
      "title": "Relatório Personalizado",
      "description": "Cada investidor acessa seu próprio relatório com dados de investimento inicial, rentabilidade acumulada e comparativo com o CDI do período."
    },
    {
      "title": "Comparativo CDI",
      "description": "Gráfico de linha mensal comparando a rentabilidade da Bioma com o CDI dos últimos 12 meses."
    },
    {
      "title": "Portfólio de Debêntures",
      "description": "Visão detalhada de todas as debêntures ativas do investidor, com PU de compra, PU atual e rentabilidade por série."
    },
    {
      "title": "Histórico de Resgates",
      "description": "Registro completo de debêntures resgatadas com valores brutos, IR, IOF e valor líquido recebido."
    }
  ],
  "techStack": [
    { "name": "React", "icon": "SiReact" },
    { "name": "Next.js", "icon": "SiNextdotjs" },
    { "name": "TypeScript", "icon": "SiTypescript" },
    { "name": "Tailwind CSS", "icon": "SiTailwindcss" },
    { "name": "Recharts", "icon": "FaChartArea" },
    { "name": "Python", "icon": "SiPython" },
    { "name": "FastAPI", "icon": "SiFastapi" },
    { "name": "PostgreSQL", "icon": "SiPostgresql" },
    { "name": "AWS", "icon": "FaAws" }
  ]
}
```

---

## ExperiencesSection Registration

```tsx
const InvestorPlataform = dynamic(
  () => import('./InvestorPlataform').then(mod => mod.InvestorPlataform),
  { ssr: false, loading: SlidePlaceholder }
)

const slides = [
  { id: 'consultancy', component: ConsultancyPlataform },
  { id: 'geomap',      component: GeoMapPlataform },
  { id: 'trading',     component: TradingPlataform },
  { id: 'investor',    component: InvestorPlataform },  // ← new
]
```

---

## iconMap Additions

Check `iconMap.tsx` for missing icons and add:
- `FaChartArea` from `react-icons/fa`
- `SiFastapi` from `react-icons/si`
- `SiPython` from `react-icons/si`

(`FaAws`, `SiPostgresql`, `SiReact`, etc. are likely already present.)

---

## Constraints & Notes

- Recharts is already a dependency (used in `ConsultancyPlataform` via `RadarChart`).
- GSAP is already imported globally; no new installs required.
- The component must be `'use client'` (uses refs + GSAP effects).
- Light theme inside the card intentionally contrasts with the dark portfolio background.
- Card direction is `"right"` (4th entry, visually balanced with 3rd card on left).
