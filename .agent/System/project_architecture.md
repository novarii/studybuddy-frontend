# StudyBuddy Frontend - Project Architecture

## Project Goal

StudyBuddy is an AI-powered study assistant that helps students learn from lecture recordings and PDF documents. The frontend provides a chat interface for RAG-based conversations, document upload, and lecture video/slide viewing.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.0.10 |
| React | React | 19.2.1 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | Radix UI | Various |
| Authentication | Clerk | 6.36.4 |
| Build Tool | Turbopack | (built-in) |

## Project Structure

```
studybuddy-frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with ClerkProvider + Toaster
│   ├── page.tsx             # Home page (protected, redirects to sign-in)
│   ├── globals.css          # Global styles, theme variables, animations
│   ├── sign-in/             # Clerk sign-in page
│   │   └── [[...sign-in]]/page.tsx
│   └── sign-up/             # Clerk sign-up page
│       └── [[...sign-up]]/page.tsx
├── components/
│   └── ui/                  # Radix-based UI component library
│       ├── button.tsx       # Button with variants (cva)
│       ├── card.tsx         # Card container components
│       ├── dialog.tsx       # Modal dialog
│       ├── dropdown-menu.tsx # Dropdown menu
│       ├── input.tsx        # Text input
│       ├── textarea.tsx     # Multiline text input
│       ├── scroll-area.tsx  # Custom scrollbar
│       ├── toast.tsx        # Toast notification
│       └── toaster.tsx      # Toast container
├── hooks/
│   └── use-toast.ts         # Toast state management hook
├── lib/
│   └── utils.ts             # cn() utility for class merging
├── types/
│   └── index.ts             # Shared TypeScript types
├── constants/
│   └── colors.ts            # Dark/light mode color schemes
├── proxy.ts                 # Clerk auth proxy (route protection)
├── .env.local               # Environment variables (not committed)
└── .env.example             # Environment template
```

## Authentication Flow

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  User Request   │────▶│   proxy.ts   │────▶│  Protected  │
│                 │     │ (Clerk auth) │     │    Route    │
└─────────────────┘     └──────────────┘     └─────────────┘
                               │
                               ▼ (if unauthenticated)
                        ┌──────────────┐
                        │   /sign-in   │
                        └──────────────┘
```

**Key Points:**
- `proxy.ts` uses `clerkMiddleware` (Next.js 16 convention, replaces deprecated `middleware.ts`)
- Public routes: `/sign-in`, `/sign-up`, `/api/webhook`
- All other routes require authentication
- `ClerkProvider` wraps the entire app in `layout.tsx`

## Styling System

### Tailwind CSS v4 Configuration

Uses the new `@import "tailwindcss"` syntax with `@theme inline` for custom properties:

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@theme inline {
  --color-background: hsl(var(--background));
  --color-primary: hsl(var(--primary));
  /* ... */
}
```

### Theme Variables (HSL format)

Defined in `globals.css` with light/dark mode support:
- Light mode: `:root { ... }`
- Dark mode: `.dark { ... }`

### Color Schemes (Hex format)

For programmatic use in `constants/colors.ts`:
- `darkModeColors`: Dark blue theme (#1a1f2e background, #7dd3fc accent)
- `lightModeColors`: Warm beige theme (#f5f1e8 background, #a67c52 accent)

### Component Variants

Using `class-variance-authority` (cva) for variant-based styling:

```tsx
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "...", ghost: "..." },
    size: { default: "...", sm: "...", lg: "...", icon: "..." }
  }
});
```

## Core Types

```typescript
// types/index.ts
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
};

type Course = {
  id: string;
  name: string;
  content: Array<{ id: string; title: string; children: string[] }>;
};

type Material = {
  id: string;
  name: string;
  file: File;
  courseId: string;
  type: "pdf" | "video";
};

type ColorScheme = {
  background: string;
  panel: string;
  card: string;
  border: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  accentHover: string;
  hover: string;
  selected: string;
  buttonIcon: string;
};
```

## Backend Integration Points

The frontend connects to a FastAPI backend at `NEXT_PUBLIC_API_URL`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/agent/chat` | POST | Streaming RAG chat (SSE) |
| `/api/documents/upload` | POST | PDF upload |
| `/api/lectures/download` | POST | Panopto lecture download |
| `/api/courses` | GET | List user courses |

**Authentication:** All API calls require Clerk JWT in `Authorization: Bearer <token>` header.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |
| `CLERK_SECRET_KEY` | Clerk backend key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route (`/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route (`/sign-up`) |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## Development Status

**Completed (Phase 1 & 2):**
- Project setup with Next.js 16, React 19, Tailwind v4
- UI component library (Radix-based)
- Clerk authentication with proxy.ts
- Theme system with dark/light mode support

**Pending (Phase 3+):**
- Main 3-column layout (Sidebar, Chat, Right Panel)
- Chat interface with SSE streaming
- Document upload with drag-and-drop
- Course management
- PDF viewer and video player

---

**Related Docs:**
- [README.md](../README.md) - Documentation index
