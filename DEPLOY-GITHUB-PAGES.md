# Publish to GitHub Pages

Use the supplied static ZIP, or regenerate it from the managed project with Bun:

```sh
bun install --frozen-lockfile
bun run build:static
```

The generated site is in `packages/web/dist-static/`. The static download includes only the compiled site and public assets, not project secrets or a server.

## Deploy

1. Unzip the static download and copy its **contents** into the root of a GitHub repository (or into its `docs/` folder). Keep `index.html`, `.nojekyll`, `assets/`, and `fonts/` together.
2. In **Settings → Pages → Build and deployment**, set **Source** to **Deploy from a branch**. Pick your branch and `/(root)` or `/docs` to match step 1.
3. Save. GitHub will show the site address on the Pages settings screen when deployment completes. Relative paths support both project sites and custom domains.

The contact form opens a draft in the visitor’s default email app; it does not send or collect messages. If no email app is configured, visitors can use the displayed institutional email address.

## Update the site

- Profile, books, and contact form: `packages/web/src/web/pages/index.tsx`.
- Article records, DOI links, and academic email: `packages/web/src/web/pages/profile-data.ts`.
- English and Croatian text: `packages/web/src/web/pages/profile-copy.ts`. English is the default on a first visit; the browser remembers the last selection.
- Styling: `packages/web/src/web/styles.css`. Fonts and licenses: `packages/web/public/fonts/`.
- The Croatian book is listed as 2022 in the Croatian National Bibliography (some city library catalogs list 2021). The Mosby textbook is a teaching reference in the School’s course materials and is not attributed to Prof. Čelebić as an author. Metrics are the supplied profile figures, not live counters.
