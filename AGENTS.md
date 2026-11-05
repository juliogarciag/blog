# Blog

A Remix 3 blog that runs on Cloudflare Workers. Posts are Markdown files in `posts/`.

## Commands

```sh
npm install
npm run dev        # local Worker at http://localhost:8787, rebuilds when a post changes
npm run typecheck
npm run deploy     # publishes to Cloudflare
```

## Writing a post

Add `posts/<slug>.md` with `title` and `date` (YYYY-MM-DD) frontmatter. It is served at
`/posts/<slug>`. The build fails if either field is missing.

## How it fits together

- `scripts/build-posts.ts` renders `posts/*.md` to HTML at build time and writes
  `app/data/posts.generated.ts` (not committed). Wrangler runs it before dev and deploy.
- `worker.ts` hands each request to the Remix router in `app/router.ts`.
- `app/routes.ts` is the URL contract; controllers and pages live in `app/actions/`;
  the shared document shell is `app/ui/document.tsx`.
- `public/` holds static files, served by Cloudflare without running the Worker.

## Worker constraints

Remix's asset server (`remix/assets`) and static-file middleware need Node and do not
bundle for Workers, so this app does not use them. That means no hydrated components or
browser-side Remix code: pages are server-rendered HTML plus the stylesheet in `public/`.
Use `wrangler dev`, not the `remix` dev server.

For Remix APIs, see `.agents/skills/remix/SKILL.md` and `node_modules/remix/INDEX.md`.
