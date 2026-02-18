# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Next.js)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint (next lint)
npm run format    # Format all files with Prettier
```

## Architecture

This is a **Next.js 14** personal portfolio page (pt-BR) for Gabriel Freitas, a full-stack developer. It uses the App Router with a single page (`src/app/page.tsx`) that composes all sections.

### Page structure

The page renders these section components in order:
- `NavBar` — top navigation
- `HeroSection` — full-viewport hero with animated name, rotating role title, social links, and a PDF CV download
- `StacksSection` — tech stack showcase with radial orbit animation
- `CoursesSection` — relevant courses display

GSAP `ScrollSmoother` + `ScrollTrigger` are initialized in `page.tsx` and control smooth scrolling across the entire page. Sections use GSAP's `data-speed` attribute for parallax effects.

### Component organization

- `src/components/<SectionName>/` — page section components (HeroSection, StacksSection, CoursesSection, NavBar, Preloader)
- `src/components/GlobalComponents/` — shared components used across sections (Card, Logo)
- `src/components/ui/` — generic, reusable UI primitives (GradualBlur, LiquidEtherBackground, ScrollFloat, TextUI/*)
- `src/components/animate-ui/` — components sourced from [animate-ui.com](https://animate-ui.com) registry

### State / Context

`GlobalContext` (`src/context/GlobalContext/`) wraps the entire app. Currently it holds no state but is the intended place for global state. Its types are in `types.ts`.

### Styling

- **Tailwind CSS v3** with DaisyUI v5 plugin
- Custom color: `bg-background` = `#0d0313` (dark purple)
- Custom font: **Mona Sans** loaded from Fontshare
- Prettier: no semicolons, single quotes, 2-space indent, trailing commas (ES5), 80-char print width, no parens for single arrow function args

### Animation libraries

Two animation libraries coexist — prefer the one already used in the file being edited:
- **Framer Motion** (`framer-motion`) — used in HeroSection for entrance animations
- **GSAP** (`gsap`) with ScrollSmoother/ScrollTrigger — used for scroll-driven animations (ScrollFloat, page-level smooth scroll)
- **Motion** (`motion`) — used inside animate-ui components

### Shadcn/animate-ui

Components from animate-ui are added via:
```bash
npx shadcn@latest add "@animate-ui/<name>"
```
The registry is configured in `components.json`.

### Path aliases

`@/` maps to `src/` (configured in `tsconfig.json`).
