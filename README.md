# Unicorn App

A Next.js application where users can create animated 3D unicorns that bounce around the screen. Built with React Three Fiber, Supabase, and Rapier physics.

## Features

- User authentication with Supabase
- Create 3D unicorns with randomized features (colors, accessories, hair styles)
- Rainbow particle effects overlay
- Physics-based bouncing unicorns
- Persistent unicorn storage
- User profile with statistics

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database & Auth**: Supabase
- **3D Rendering**: React Three Fiber (@react-three/fiber, @react-three/drei)
- **Physics**: @react-three/rapier
- **Styling**: Tailwind CSS

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Database Migration

1. In your Supabase dashboard, go to SQL Editor
2. Run the migration file: `supabase/migrations/001_create_unicorns_table.sql`

This will create:
- The `unicorns` table with proper schema
- Row Level Security (RLS) policies
- Indexes for performance

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - React components (Unicorn, ParticleRainbow, etc.)
- `src/lib/` - Utilities (Supabase client, unicorn services, feature generation)
- `src/contexts/` - React contexts (AuthContext)
- `supabase/migrations/` - Database migration files

## Deployment

The app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your Supabase environment variables in Vercel settings
4. Deploy!

## License

See LICENSE file for details.
