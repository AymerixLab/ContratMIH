# Repository Guidelines

## Project Structure & Module Organization
- `index.html`: Root page; mounts the React app.
- `src/main.tsx`: Vite/React entry; renders `App`.
- `src/App.tsx`: App shell and page composition.
- `src/components/pages/*`: Screen-level pages (PascalCase files, e.g., `IdentityPage.tsx`).
- `src/components/ui/*`: Reusable UI primitives (lowercase/hyphenated files exporting PascalCase components).
- `src/lib/*`: Types, constants, utilities, and document helpers.
- `src/styles/globals.css` and `src/index.css`: Global styles and tokens.
- `src/assets/*`: Static images used by components.

## Build, Test, and Development Commands
- `npm i`: Install dependencies.
- `npm run dev`: Start Vite dev server on `http://localhost:3000`.
- `npm run build`: Production build to `build/` (see `vite.config.ts`).
- Preview (optional): `npx vite preview` to serve the production build locally.

## Coding Style & Naming Conventions
- Language: TypeScript + React 18, functional components and hooks.
- Components: Export PascalCase (e.g., `Button`); prefer named exports from UI primitives.
- Files: Pages in PascalCase; UI primitives in `src/components/ui` use lowercase/hyphenated filenames (e.g., `alert-dialog.tsx`).
- Utilities: Reuse helpers in `src/lib` (e.g., `cn` in UI utils) instead of ad‑hoc implementations.
- Styles: Use CSS variables in `src/styles/globals.css`; keep component styles colocated or themed via tokens.
- Formatting: Two-space indentation; keep imports ordered (libs, aliases, relative).

## Testing Guidelines
- Current status: No test runner configured.
- If adding tests, use Vitest + React Testing Library.
  - File names: `*.test.ts` / `*.test.tsx` next to the source.
  - Scripts (example): add `"test": "vitest"` and `"test:watch": "vitest --watch"`.

## Commit & Pull Request Guidelines
- Commits: Follow Conventional Commits (e.g., `feat(ui): add button focus ring`, `fix(pwa): correct icon path`). Keep messages imperative and scoped (`ui`, `ux`, `pwa`, etc.).
- PRs: Include a concise description, linked issues (e.g., `Closes #123`), screenshots/GIFs for UI changes, and clear test/QA notes.
- Keep PRs focused and small; update docs when behavior or structure changes.

## Security & Configuration Tips
- Do not commit secrets; prefer environment variables when adding integrations.
- Static assets live in `src/assets/`; import relatively. Only extend Vite aliases in `vite.config.ts` when necessary.
- The dev server runs on port `3000`; production output is in `build/`.
