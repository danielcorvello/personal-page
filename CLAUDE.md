# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server (localhost:3000)
npm run build      # Production build
npm run serve      # Serve built site locally
npm run clear      # Clear Docusaurus cache
npm run typecheck  # TypeScript type checking
```

## Architecture

This is a personal blog built with **Docusaurus v3.9.2**, written in Portuguese (pt-BR), deployed to GitHub Pages at `corvello.com`.

- **`docusaurus.config.ts`** — central configuration: routes, plugins, navbar, footer, syntax highlighting (C#, Bash, PowerShell, HTTP, ASP.NET), redirects, and Google Analytics.
- **`blog/`** — all blog posts as Markdown, organized by `YYYY/MM/` subdirectories. `authors.yml` and `tags.yml` define metadata.
- **`src/pages/`** — standalone pages (e.g. `sobre-mim.md` = About Me).
- **`src/css/custom.css`** — global CSS overrides.
- **`static/img/`** — images and favicons.

The blog plugin is configured as the root route (`routeBasePath: '/'`). The docs plugin is present but disabled. Deployment is automated via `.github/workflows/deploy.yml` on push to `main`.

## Blog Post Format

New posts go in `blog/YYYY/MM/` as `.md` or `.mdx` files with frontmatter:

```md
---
title: Post Title
description: Short description
slug: url-slug
authors: [danielcorvello]
tags: [dotnet, csharp]
---
```

Authors are defined in `blog/authors.yml`; tags in `blog/tags.yml`.
