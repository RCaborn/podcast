# Counter Culture

Counter Culture is a community platform for independent food retailers — delis, butchers, cheesemongers, and farm shops. It features editorial articles, a weekly newsletter, and community discussion forums, all wrapped in a distinctive brand identity built around sharp corners, terracotta accents, and serif typography.

## Setup

```bash
git clone <repo-url>
cd podcast
npm install
cp .env.example .env
```

Open `.env` and add your Supabase project URL and anon key:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database

Run the schema migration and seed data against your Supabase project:

1. Go to your Supabase dashboard → SQL Editor
2. Run `supabase/migrations/001_initial_schema.sql` to create tables and RLS policies
3. Run `supabase/migrations/002_design_refresh.sql` to add new columns and update constraints
4. Run `supabase/seed.sql` to populate sample data (this inserts stub `auth.users` rows first, then profiles, articles, threads, and replies)

Or via the Supabase CLI:

```bash
supabase db push
supabase db seed
```

## Development

```bash
npm run dev
```

Opens the Vite dev server at `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for bundling and dev server
- **Tailwind CSS v4** for styling
- **React Router v6** for client-side routing
- **Supabase** for auth, database, and real-time
- **react-markdown** for rendering article content
- **Vercel** for deployment (SPA rewrite via `vercel.json`)
