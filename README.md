# Full Stack FastAPI Template - Svelte Fork

A personal fork of [fastapi/full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template)
with the frontend rewritten from **React to Svelte** - same FastAPI backend, same features, but Svelte,
because I don't like React lol.

## Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI + SQLModel + Alembic (unchanged from upstream) |
| Database | PostgreSQL 18 |
| Frontend | **SvelteKit 2 + Svelte 5** in SPA mode (`ssr=false`, adapter-static) |
| UI | shadcn-svelte (bits-ui), Tailwind CSS v4, lucide icons, svelte-sonner |
| Data | @tanstack/svelte-query, @tanstack/svelte-table |
| Forms | sveltekit-superforms (zod4) + formsnap |
| API Client | Generated from OpenAPI via @hey-api/openapi-ts (fetch flavor) |
| Email Authoring | better-svelte-email, exported to HTML + Jinja2 for the backend |

## Commands

```bash
bun install                                # root workspace
bun run --filter frontend dev              # dev frontend
bun run --filter frontend build            # build -> backend/app/frontend
bun run --filter frontend check            # svelte-check
bun run --filter frontend lint             # biome (TS/JS only)
bash scripts/generate-client.sh            # regenerate API client from backend OpenAPI
bun run --filter emails dev                # preview email templates
bun run --filter emails export             # export emails -> backend/app/email-templates/*.html
```
