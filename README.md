# MRKOON Audit

Admin/audit dashboard for the MRKOON platform. A clean skeleton built on the
same template, theme, and authentication as the MRKOON User Portal — with all
business features stripped out so new audit modules can be built on top.

Stack: **React 19 + TypeScript + Vite + MUI v7** (Minimal UI Kit v7).

## Prerequisites

- Node.js >= 20
- [Bun](https://bun.sh) (package manager)

## Installation

```sh
bun install
```

Env is preconfigured to point at the **mrkoon-admin** backend (`apiAdmin`), same
as the admin dashboard. `.env` targets staging; `dev.env` / `stg.env` /
`.env.example` mirror mrkoon-admin's per-environment values. `VITE_HOST_API` is
the API base URL.

```sh
cp .env.example .env   # (or use the provided stg .env as-is)
```

## Commands

```sh
bun dev          # Start dev server (port 8080)
bun build        # TypeScript check + Vite production build
bun lint         # ESLint check
bun lint:fix     # ESLint auto-fix
bun fm:check     # Prettier check
bun fm:fix       # Prettier format
bun fix:all      # Run both lint:fix and fm:fix
```

## What's included

- Full Minimal UI Kit theme, layouts (dashboard / auth-split / simple), settings
  drawer, i18n (en / ar-SA / ar-EG), and reusable components.
- JWT authentication wired to the mrkoon-admin backend — two-step login
  (phone + password → `auth/login`, then OTP code → `auth/check_code_to_login`),
  same endpoints and flow as mrkoon-admin.
- Redux Toolkit + Redux Persist store (user, dashboard, user-preferences) and
  TanStack React Query setup.
- Firebase Cloud Messaging push-notification scaffolding.
- A single blank dashboard landing page (`/dashboard`) ready to extend.

## What was removed

All MRKOON business modules (auctions, products, transportations, reports, CEO
dashboard, price offers, warehouses, invitations, inspections, orders, checkout,
users & permissions UI) and the Minimal marketing site / component showcase.
Build new audit modules under `src/sections/<feature>` following the patterns in
`CLAUDE.md`.
