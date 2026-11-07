# Irfan Sadik — Developer Portfolio

A responsive, accessible, framework-free portfolio built with HTML, CSS, and vanilla JavaScript.

## Run locally

Use a local HTTP server (ES modules require HTTP rather than `file://`):

```bash
python3 -m http.server 8000
```

Visit http://localhost:8000.

## Features

- Responsive editorial design, warm-neutral/deep-navy themes
- Theme persistence and system preference on first visit
- Accessible mobile navigation and reduced-motion support
- Four curated project descriptions and verified-on-load GitHub links
- Public GitHub repositories via REST API with graceful failure handling
- Direct email, GitHub, LinkedIn, and Google Drive résumé links
- No build tools or frontend framework required

## Repository verification

The featured projects are editorially curated. The page fetches public repositories from `t0m0dachi88` and adds a featured repository link **only** when exactly one public, non-fork repository matches its conservative name pattern. If a match is missing or ambiguous, no link is fabricated. Repository descriptions and tags on the featured cards are high-level descriptions provided in the brief; they are not independently verified against source code. Review the repositories before adding implementation-specific claims. The API loads at runtime; a network connection is required for dynamic repository listings. Public GitHub API rate limits apply.

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Sign in to [Vercel](https://vercel.com), select **Add New → Project**, and import the repository.
3. Choose **Other** as framework preset. Leave build command empty and use `.` as output directory (or Vercel's static defaults).
4. Deploy. `index.html` at the root is the entry point; no environment variables are needed.
5. For a custom domain, open **Project → Settings → Domains**, add your domain, and follow Vercel's displayed DNS instructions.

This archive has not been deployed to a live Vercel account.

## Update content

- Text, featured projects, and contact URLs: `index.html`
- Colors, spacing, and layout: `css/style.css`
- Theme, navigation, and GitHub behavior: `js/main.js`
- GitHub username and conservative project matching: `js/main.js`

## Manual browser QA checklist

Check 360, 390, 768, 1024, and 1440px viewports. Test menu open/close, keyboard navigation, theme persistence after reload, reduced-motion setting, contact and résumé URLs, GitHub API success and failure (via browser offline mode), horizontal overflow, and console errors. The implementation has been statically checked, but browser-device and production deployment verification remain necessary.
