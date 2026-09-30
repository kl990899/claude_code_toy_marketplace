# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A toy marketplace web app (list/browse toys, save items, buyer–seller messaging). Originally scaffolded with Lovable: Vite + React 18 + TypeScript + shadcn/ui (Tailwind, Radix) on the frontend, Supabase (Postgres, Auth, Storage, Realtime) as the entire backend. There is no custom server.

## Commands

```bash
npm run dev          # Vite dev server on port 8080 (host "::")
npm run build        # production build
npm run build:dev    # development-mode build
npm run lint         # eslint .
npm run preview      # preview the production build
```

There is no test framework configured.

### Local Supabase

```bash
supabase start       # local stack; Studio at http://localhost:54323, API at http://127.0.0.1:54321
supabase db reset    # re-apply all migrations + supabase/seed.sql
supabase migration new <name>   # then edit the generated SQL and run `supabase db reset`
```

Deploying schema to the remote project: `supabase link --project-ref <ref>` then `supabase db push`.

## Architecture

- **Supabase client switches on hostname**: [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts) points at the local stack (`127.0.0.1:54321`) when the page is served from `localhost`/`127.0.0.1`, otherwise at the remote project. So `npm run dev` requires `supabase start` to be running. This file and `types.ts` are generated — don't edit by hand; regenerate `types.ts` after schema changes.
- **Data access goes through RPC functions, not direct table queries.** Tables are protected by RLS, and joins across tables (products ↔ profiles ↔ images, conversations ↔ participants ↔ messages) silently return empty results under RLS. The established pattern is `SECURITY DEFINER` SQL functions (e.g. `get_public_products`, `get_public_product_detail`, `get_user_conversations`, `get_conversation_messages_with_read_status`, `get_user_saved_products`, `toggle_saved_product`, `create_conversation`, `mark_conversation_read`) called via `supabase.rpc(...)`. Before writing a new query, check the existing functions in [supabase/migrations/](supabase/migrations/) and reuse one; if none fits, add a new RPC function in a new migration rather than querying/joining tables directly from the client.
- **Schema** lives in `supabase/migrations/00000000_consolidated_migration.sql` (tables: `profiles`, `products`, `product_images`, `conversations`, `participants`, `messages`, `message_status`, `saved_products`) plus later incremental migrations. Triggers handle side effects: `handle_new_user` creates a profile on signup, `add_participants_on_conversation` inserts buyer+seller participants, `bump_conversation_on_message` updates conversation `updated_at`. Changing a function's return type requires `DROP FUNCTION` then `CREATE` (see the `20250909054742_*` migration).
- **Storage**: public bucket `product-images`; policies require the object path's first folder to be the uploader's `auth.uid()`. Images are resized client-side before upload ([src/lib/imageUtils.ts](src/lib/imageUtils.ts)); upload flow is in `CreateListingForm.tsx`.
- **Realtime**: `PresenceProvider` (wraps the whole app in `App.tsx`) tracks online users on a global `global-presence` channel, exposed via `usePresence()`. `ConversationDetail.tsx` subscribes to a per-conversation `messages:<id>` channel.
- **Frontend data hooks** in `src/hooks/` (`useAuth`, `usePublicProducts`, `useUserProducts`, `useSavedProducts`, `useUnreadMessagesCount`, ...) use plain `useState`/`useEffect` + `supabase` calls; React Query's provider is mounted but not the prevailing pattern.
- **Routing** is defined in `src/App.tsx`; add new routes above the catch-all `*` route. `/` renders `Categories`.
- `src/components/ui/` is shadcn/ui generated code (config in `components.json`); `@/` aliases `src/`.
- Vite `base` is `/claude_code_toy_marketplace/` (GitHub Pages-style deploy; `gh-pages` is a devDependency).
- TypeScript is non-strict (`strict: false`, `noImplicitAny: false`).

## Conventions

- Name component/page files in PascalCase matching the component (e.g. `CreateListingForm.tsx`).
- Don't commit PII (e.g. emails) or secrets. `.mcp.json` and `.env` are gitignored; copy from `.mcp.json.example*` (platform-specific variants exist) and fill in the Supabase project ref/access token locally.
- Google OAuth is enabled as an auth provider in the Supabase project.
