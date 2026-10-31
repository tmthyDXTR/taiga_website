# Taiga Website

Musician website built with React, TypeScript, and Vite. Features multi-language support, and responsive design.

## Tech Stack

React 19 • TypeScript • Vite • React Router • i18next

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── components/    # Footer, LanguageSwitcher, LogoHeader
├── pages/         # HomePage, MusicPage, WorkshopsPage, ProjectsPage, BlogPage, AdminPage, ImpressumPage
└── i18n/          # Translations (EN, DE, ES, JA)
public/api/        # PHP + MySQL backend for the blog (posts, auth, upload, import)
blog_entries/      # Exported WordPress posts (HTML) for the admin import
```

## Scripts

- `npm run dev` - Development server (proxies `/api` and `/uploads` to port 8000)
- `npm run dev:api` - Local PHP server for the blog API (`php -S localhost:8000 -t public`)
- `npm run build` - Production build
- `npm run preview` - Preview build

## Features

- Chameleon cursor and interactive navigation
- 4 languages with automatic detection
- Vinyl record UI on music page
- Workshop listings
- Blog at `/blog` with previews and a full-screen reader
- Admin at `/admin` to write, edit and import blog posts
- Mobile-optimized

## Blog & Admin

Posts live in a MySQL/MariaDB table (`blog_posts`, created automatically on the first request). The frontend talks to the PHP scripts in `public/api/`.

**Setup**

1. Copy `public/api/config.sample.php` to `public/api/config.php` and fill in the DB host, name, user and password (`db_port` is optional). This file is gitignored and never deployed by `deploy.sh`.
2. Generate the admin password hash and put it in `admin_password_hash`:
   `php -r 'echo password_hash("your-password", PASSWORD_DEFAULT), "\n";'`
3. PHP needs the `pdo_mysql` and `fileinfo` extensions.

**Local development**

Run `npm run dev:api` and `npm run dev` in two terminals, using a local MariaDB/MySQL database in `config.php`. Uploaded images go to `public/uploads/blog/` (gitignored, not deployed).

**Admin (`/admin`)**

- Password login (session cookie, same-origin checks).
- Create, edit and delete posts; set the post date; publish or keep as draft.
- Editor with simple HTML formatting (bold, italic, headings, lists, quotes, links), image upload, and a live preview that matches the blog view.
- Batch import: select exported WordPress `.html` files (see `blog_entries/`). Title, date, tags and body are read from each file; files already imported are skipped.
- HTML is sanitized server-side against an allowlist of tags before saving.

## Deploy

Build with `npm run build`, then run `./deploy.sh`. It syncs `dist` to the server but skips `api/config.php` and `uploads/`, so create `config.php` on the server once.
