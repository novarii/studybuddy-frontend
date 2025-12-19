# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Architecture

This is the Next.js 16 frontend for StudyBuddy, an AI-powered study assistant. It connects to a FastAPI backend for RAG-based chat, document processing, and lecture transcription.

### Tech Stack
- **Next.js 16** with App Router and Turbopack
- **React 19** with Server Components
- **Tailwind CSS v4** with `@import "tailwindcss"` syntax
- **Clerk** for authentication (uses `proxy.ts`, not deprecated `middleware.ts`)
- **Radix UI** primitives with custom styled components

### Key Directories
- `app/` - Next.js App Router pages and layouts
- `components/ui/` - Reusable Radix-based UI components (button, dialog, dropdown-menu, toast, etc.)
- `hooks/` - Custom React hooks (e.g., `use-toast.ts`)
- `types/` - Shared TypeScript types (`ChatMessage`, `Course`, `Material`, `ColorScheme`)
- `constants/` - Theme colors for dark/light modes
- `lib/utils.ts` - `cn()` utility for Tailwind class merging

### Authentication Flow
- `proxy.ts` handles route protection via Clerk's `clerkMiddleware`
- Public routes: `/sign-in`, `/sign-up`, `/api/webhook`
- All other routes require authentication
- ClerkProvider wraps the app in `app/layout.tsx`

### Environment Variables
Copy `.env.example` to `.env.local` and configure:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` - Clerk auth keys
- `NEXT_PUBLIC_API_URL` - Backend API endpoint (default: `http://localhost:8000/api`)

### Styling Conventions
- Use `cn()` from `@/lib/utils` for conditional class merging
- Theme variables defined in `app/globals.css` using HSL format
- Components use `class-variance-authority` (cva) for variants
- Dark mode via `.dark` class with CSS custom properties

### Backend Integration
The backend (FastAPI) provides:
- `POST /api/agent/chat` - Streaming RAG chat (SSE, Vercel AI SDK format)
- `POST /api/documents/upload` - PDF upload
- `POST /api/lectures/download` - Panopto lecture download
- `GET /api/courses` - List user courses

All API calls require Clerk JWT in Authorization header.
