# Société le Monde Informatique

The bilingual SMI corporate website, built with React, TypeScript and Vite from the validated master specification in `docs/SMI_NEW_WEBSITE_MASTER_SPEC.md`.

## Getting started

Use Node.js 22.12+ (22.x) or Node.js 24+. Node.js 24 LTS is recommended.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173). Changes in `src` reload automatically.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run typecheck` | Check TypeScript |
| `npm run lint` | Check code and React Hooks rules |
| `npm run build` | Check TypeScript and create the production site in `dist/` |
| `npm run preview` | Serve the production build locally |

Deploy the generated `dist/` folder to a host configured to return `index.html` for application routes.

## Routes

Every page is available in French and English under `/fr/` and `/en/`:

- Home
- IBANSYS
- SWIFT+ Messaging Hub
- Banking Transformation
- Expertise
- Why SMI
- Customer Success
- Insights
- Careers
- Contact

The language switch retains the equivalent page path.

## Project layout

- `index.html`: page title, metadata, and React entry point.
- `src/main.tsx`: React application bootstrap.
- `src/App.tsx`: routes, shared components, pages and interaction tracking hooks.
- `src/site-content.ts`: reusable bilingual content and partner data.
- `src/index.css`: brand tokens, layouts, components and responsive styles.
- `src/imports/`: original exported image assets.
- `public/`: static files served without processing.
- `vite.config.ts`: React and Tailwind integrations; `@/` points to `src/`.

## Existing limitations

The contact form validates its fields and demonstrates the follow-up state, but does not send or store messages. Connect it to the selected backend or CRM before production. Analytics events are pushed to `window.dataLayer` when an analytics provider creates it. Legal copy and partner-logo permissions require final review before launch.
