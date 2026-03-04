# Counter Culture — Design System & Dev Guide

## Project

Counter Culture is a podcast community platform built with React, TypeScript, Vite, Tailwind CSS v4, React Router v6, and Supabase.

## Colour Palette

| Token           | Hex       | Usage                          |
|-----------------|-----------|--------------------------------|
| `ochre-50`      | `#fdf8ef` | Ochre tint backgrounds         |
| `ochre-100`     | `#faecd5` | Hover states, subtle fills     |
| `ochre-200`     | `#f4d5aa` |                                |
| `ochre-300`     | `#edb974` |                                |
| `ochre-400`     | `#e49a42` | Accent highlights              |
| `ochre-500`     | `#dc8226` |                                |
| `ochre-600`     | `#c8841d` | **Primary ochre** — eyebrows, rules, tags |
| `ochre-700`     | `#9a5118` |                                |
| `ochre-800`     | `#7c411b` |                                |
| `ochre-900`     | `#653619` |                                |
| `ochre-950`     | `#391b0a` |                                |
| `forest-50`     | `#f0f7f4` | Forest tint backgrounds        |
| `forest-100`    | `#dbece3` |                                |
| `forest-200`    | `#bad8ca` |                                |
| `forest-300`    | `#8dbdaa` |                                |
| `forest-400`    | `#5f9d86` |                                |
| `forest-500`    | `#3f816b` |                                |
| `forest-600`    | `#2f6755` |                                |
| `forest-700`    | `#275345` |                                |
| `forest-800`    | `#1b4332` | **Primary forest** — buttons, dark UI |
| `forest-900`    | `#1a3a2e` |                                |
| `forest-950`    | `#0d201a` |                                |
| `cream`         | `#faf7f2` | Page background                |
| `sand`          | `#e8dfd0` | Card / section dividers        |
| `charcoal`      | `#1a1a1a` | Body text, dark backgrounds    |

## Typography

| Token          | Family             | Usage                           |
|----------------|--------------------|---------------------------------|
| `font-display` | Playfair Display   | Headlines, Logo "Counter"       |
| `font-body`    | Barlow             | Body copy, paragraphs           |
| `font-ui`      | Barlow Condensed   | Buttons, labels, eyebrows, tags |

### Google Fonts Weights Loaded

- **Playfair Display**: 400, 700, 900, italic 400, italic 700
- **Barlow**: 300, 400, 500, 600
- **Barlow Condensed**: 400, 600, 700

## Design Patterns

- **Sharp corners** — no border-radius on buttons, tags, or cards (0px)
- **Ochre rules** — 2px horizontal rules in `ochre-600` used as dividers
- **Uppercase UI text** — all Barlow Condensed elements are uppercase with wide tracking
- **Eyebrow labels** — small ochre uppercase labels above headings (`font-ui`, `text-xs`, `font-semibold`, `uppercase`, `tracking-[0.15em]`, `text-ochre-600`)
- **Section headers** — eyebrow + Playfair Display bold title + ochre divider line

## Component Inventory

| Component       | Path                                | Props                                       |
|-----------------|-------------------------------------|---------------------------------------------|
| `Logo`          | `src/components/ui/Logo.tsx`        | `size: sm\|md\|lg`, `variant: light\|dark\|forest\|ochre` |
| `Eyebrow`       | `src/components/ui/Eyebrow.tsx`     | `children`, `className`                     |
| `Tag`           | `src/components/ui/Tag.tsx`         | `children`, `variant: filled\|outlined`, `className` |
| `Button`        | `src/components/ui/Button.tsx`      | `variant: primary\|secondary`, `+ native button props` |
| `Avatar`        | `src/components/ui/Avatar.tsx`      | `initials`, `color: ochre\|forest\|charcoal`, `size: sm\|md\|lg` |
| `SectionHeader` | `src/components/ui/SectionHeader.tsx` | `eyebrow`, `title`, `className`           |

## Routes

| Path                     | Page (not yet built)  |
|--------------------------|-----------------------|
| `/`                      | Home                  |
| `/articles/:slug`        | Article detail        |
| `/newsletter`            | Newsletter listing    |
| `/newsletter/:slug`      | Newsletter issue      |
| `/community`             | Community / forums    |
| `/community/:threadId`   | Thread detail         |
| `/join`                  | Sign-up               |
| `/login`                 | Log-in                |
| `/profile/:userId`       | User profile          |

## Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
