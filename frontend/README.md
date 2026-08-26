# Frontend (SvelteKit)

SPA built with SvelteKit 2 + Svelte 5, running in SPA mode (`ssr=false`, adapter-static).
The production build is written to `../backend/app/frontend` and served by FastAPI.

## Stack

- shadcn-svelte components (`src/lib/components/ui`) on Tailwind CSS v4
- @tanstack/svelte-query and @tanstack/svelte-table
- sveltekit-superforms + formsnap with zod schemas
- Generated API client in `src/lib/client` (do not edit manually)

## Development

```bash
bun install            # from repo root workspace
bun run --filter frontend dev
```

The app expects the API at `VITE_API_URL` (see `.env`, default `http://localhost:8000`).

## Checks

```bash
bun run --filter frontend check        # svelte-check
bun run --filter frontend lint         # biome (TS/JS only; .svelte excluded by design)
bun run --filter frontend build        # production build -> backend/app/frontend
```

## API Client

```bash
bash scripts/generate-client.sh        # from repo root; regenerates src/lib/client
```

## E2E Tests

```bash
bunx playwright test                   # requires PLAYWRIGHT_BASE_URL (defaults to http://localhost:8000)
```

Note: Biome intentionally does not process `.svelte` files (it cannot see template usage of
imports). Type and template validation happens through `svelte-check`.
