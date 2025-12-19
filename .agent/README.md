# StudyBuddy Frontend - Documentation Index

This directory contains all critical documentation for engineers working on the StudyBuddy frontend.

## Quick Start

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:3000
pnpm build            # Production build
pnpm lint             # Run ESLint
```

**Prerequisites:** Copy `.env.example` to `.env.local` and add your Clerk keys.

---

## Documentation Structure

### System (Architecture & Design)

| Document | Description |
|----------|-------------|
| [project_architecture.md](./System/project_architecture.md) | Tech stack, project structure, authentication flow, styling system, types, and backend integration points |

### Tasks (PRD & Implementation Plans)

*No tasks documented yet. Add implementation plans here as features are developed.*

### SOP (Standard Operating Procedures)

*No SOPs documented yet. Add best practices for common tasks here.*

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `proxy.ts` | Clerk auth route protection |
| `app/layout.tsx` | Root layout with ClerkProvider |
| `app/globals.css` | Theme variables and animations |
| `lib/utils.ts` | `cn()` class merging utility |
| `types/index.ts` | Shared TypeScript types |
| `constants/colors.ts` | Dark/light color schemes |
| `components/ui/*` | Radix-based UI components |

---

## Tech Stack Summary

- **Next.js 16** with App Router
- **React 19** with Server Components
- **Tailwind CSS v4** with `@import "tailwindcss"` syntax
- **Clerk** for authentication
- **Radix UI** for accessible components
