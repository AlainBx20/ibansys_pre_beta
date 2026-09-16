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

## Production HTTPS image

The production image serves the built site through Nginx and obtains a Let’s Encrypt certificate with Certbot. Nginx accepts TLS 1.2 and TLS 1.3 only. Certbot checks for renewal every 12 hours and reloads Nginx after renewal.

Before starting it, point the domain DNS records to the server and allow inbound TCP traffic on ports 80 and 443. Port 80 remains available for the ACME HTTP-01 challenge and redirects normal traffic to HTTPS.

```sh
cp .env.production.example .env.production
# Edit DOMAIN, optional WWW_DOMAIN, and CERTBOT_EMAIL.
docker compose --env-file .env.production -f compose.production.yml up -d --build
```

The `letsencrypt` volume must remain persistent across image updates. Use `CERTBOT_STAGING=1` for issuance testing, then remove the staging volume before requesting the production certificate.

For a future Kubernetes deployment, terminate TLS at the ingress with cert-manager and run this image behind the ingress as a plain HTTP service. The application build itself does not depend on where TLS terminates.

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
- Privacy Policy, Legal Notice and Cookie Policy

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

No Limits By A.
