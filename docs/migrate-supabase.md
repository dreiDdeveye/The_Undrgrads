# Supabase Migration

Use this when moving the app to another Supabase project.

## 1. Create the schema

In the target Supabase project, open **SQL Editor**, paste the contents of:

```text
supabase/migrations/20260505000000_initial_schema.sql
```

Run it once.

## 2. Copy existing data

Install/use PostgreSQL tools, then export from the old project and import into the new one:

```powershell
pg_dump "SOURCE_DATABASE_URL" --data-only --inserts --schema public --file undergrads-data.sql
psql "TARGET_DATABASE_URL" --file undergrads-data.sql
```

Get each database URL from Supabase:

```text
Project Settings -> Database -> Connection string -> URI
```

Replace `[YOUR-PASSWORD]` in the copied URI with the database password.

## 3. Update app environment variables

Set these to the target project values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

For local development, put them in `.env.local`. For Vercel, update the project environment variables and redeploy.

## 4. Check table access

This app reads/writes Supabase directly from browser components. If you enable Row Level Security on these tables, add matching policies first or the dashboard/shop will start getting permission errors.
