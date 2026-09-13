# Md Ariful Islam — Portfolio

Minimal, fast, static portfolio site built with [Eleventy (11ty)](https://www.11ty.dev/).
Plain HTML/CSS output, one small JS file, no framework, no server, no database.

## Run it

```bash
npm install       # one-time
npm start         # dev server + live reload at http://localhost:8080
npm run build     # production build into _site/
```

Deploy: push `_site/` (or let Vercel / Netlify / GitHub Pages run `npm run build`,
publish directory `_site`).

## Add content — no code changes needed

### Add a project
Each project is **one folder**: create `content/projects/<slug>/index.md`, and
put any screenshots for that project in `content/projects/<slug>/images/`.

```
content/projects/my-project/
  index.md
  images/
    cover.png
    screenshot-2.png
```

```markdown
---
title: My Project
date: 2025-01-20
summary: One or two sentences shown on the cards.
tech: [Python, FastAPI, PostgreSQL]
github: https://github.com/you/repo        # optional, "" if none
demo: https://example.com                  # optional, "" if none
featured: true                             # true = also show on the landing page
cover: cover.png                           # optional — filename only, from this project's own images/ folder
gallery: [cover.png, screenshot-2.png]     # optional — shown on the project's detail page
---

Full description in Markdown.
```

`<slug>` (the folder name) becomes the URL: `/projects/<slug>/`. Image filenames
in `cover` and `gallery` are just the bare filename from that project's own
`images/` folder — no path, no other file to edit. It all appears automatically
at `/projects/` and `/projects/<slug>/`.

### Add a blog post
Create `content/blog/<slug>.md`:

```markdown
---
title: My Post
date: 2026-03-01
summary: Shown in the blog listing.
tags: [automation, ai]
draft: false     # true = hidden from the build
---

Post body in Markdown.
```

Appears at `/blog/` and `/blog/<slug>/`, newest first.

### Add a reference
Create `content/references/<slug>.md` (fields: `name`, `role`, `company`,
`relationship`, `quote`, `contact`, `order`, `draft`).

### Edit bio / skills / experience / education
These live in small JSON files under `src/_data/` (`person.json`, `skills.json`,
`experience.json`, `education.json`, `site.json`, `nav.json`). Edit the file, not
the templates.

### Portrait photo
Drop `photo.png` (or `photo.jpg` / `photo.webp`) in the project root. The build
copies it to `/assets/img/`. The hero references it via `person.json` →
`hero.photo`. Keep it roughly square; ~600×600 and < 200 KB is plenty.

### Hero text
Edit `src/_data/person.json` → `hero` (greeting, name, `lines`, `chips`).

## Structure

```
.eleventy.js              build config (collections, filters, passthrough)
content/                  all editable content
  projects/  blog/  references/
src/
  _data/                  bio, skills, experience, education, nav, site meta
  _includes/              base.njk + project.njk + post.njk + partials/
  assets/css/  assets/js/
  index.njk                landing page
  projects/index.njk       projects listing
  blog/index.njk           blog listing
_site/                    build output (gitignored)
```

## Future: RAG chat widget

`src/_includes/partials/chat-widget.njk` is the single mount point. The future
widget needs only a `<div>` + `<script>` added there — no other file changes.
