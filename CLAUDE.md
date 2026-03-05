# Counter Culture — Design System & Dev Guide

## Project

Counter Culture is a podcast community platform built with React, TypeScript, Vite, Tailwind CSS v4, React Router v6, and Supabase.

## Colour Palette

| Token           | Hex       | Usage                          |
|-----------------|-----------|--------------------------------|
| `ink`           | `#2c2416` | Primary text, dark UI          |
| `warm-white`    | `#faf8f4` | Page background                |
| `cream`         | `#f0ece4` | Card fills, reply cards        |
| `stone`         | `#e2ddd4` | Heavier fills (join banner), dividers |
| `terracotta`    | `#c4795a` | **Primary accent** — eyebrows, rules, newsletter tags |
| `sienna`        | `#a85d3e` | Deeper accent — opinion tags, hover text |
| `olive`         | `#6b7c5e` | **Secondary accent** — success/community tags, buttons |
| `olive-muted`   | `#8a9a7a` | Soft green — ghost tags on dark bg |
| `brass`         | `#b69f72` | Warm metallic — industry tags, newsletter labels |
| `slate`         | `#7a7168` | Subdued text, captions         |
| `charcoal`      | `#3d352c` | Dark card backgrounds, newsletter strip |
| `parchment`     | `#ffffff` | Pure white                     |

## Colour-by-Content-Type

| Content Type    | Colour      |
|-----------------|-------------|
| Newsletter      | terracotta  |
| Success Story   | olive       |
| Opinion         | sienna      |
| Industry News   | brass       |
| Community       | olive       |

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
- **Terracotta rules** — 2px horizontal rules in `terracotta` used as dividers
- **Uppercase UI text** — all Barlow Condensed elements are uppercase with wide tracking
- **Eyebrow labels** — small terracotta uppercase labels above headings (`font-ui`, `text-xs`, `font-semibold`, `uppercase`, `tracking-[0.15em]`, `text-terracotta`), optional trailing 1px rule
- **Section headers** — eyebrow + Playfair Display bold title + terracotta divider line
- **Content-type tags** — Tag colour is determined by article tag / content type (see table above)

## Component Inventory

| Component       | Path                                  | Props                                       |
|-----------------|---------------------------------------|---------------------------------------------|
| `Logo`          | `src/components/ui/Logo.tsx`          | `size: sm\|md\|lg`, `variant: light\|dark`  |
| `Eyebrow`       | `src/components/ui/Eyebrow.tsx`       | `children`, `rule?: boolean`, `className`   |
| `Tag`           | `src/components/ui/Tag.tsx`           | `children`, `variant: filled\|outlined`, `contentType?: string`, `className` |
| `Button`        | `src/components/ui/Button.tsx`        | `variant: primary\|secondary`, `+ native button props` |
| `Avatar`        | `src/components/ui/Avatar.tsx`        | `initials`, `color: olive\|terracotta\|charcoal`, `size: sm\|md\|lg` |
| `SectionHeader` | `src/components/ui/SectionHeader.tsx` | `eyebrow`, `title`, `className`             |

## Shared Utilities

| Utility            | Path                          | Purpose                              |
|--------------------|-------------------------------|--------------------------------------|
| `mapAvatarColor`   | `src/lib/avatarColor.ts`      | Maps DB avatar_colour to Avatar prop |
| `uploadFacePhoto`  | `src/lib/storage.ts`          | Upload face photo to Supabase Storage |
| `uploadShopPhoto`  | `src/lib/storage.ts`          | Upload shop photo to Supabase Storage |

## Routes

| Path                     | Page                  |
|--------------------------|-----------------------|
| `/`                      | Home                  |
| `/articles/:slug`        | Article detail        |
| `/newsletter`            | Newsletter listing    |
| `/newsletter/:slug`      | Newsletter issue      |
| `/community`             | Community / forums    |
| `/community/:threadId`   | Thread detail         |
| `/directory`             | Member directory      |
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
