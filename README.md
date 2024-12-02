# Kanban Board with Supabase

A modern Kanban board application built with React, TypeScript, and Supabase for authentication and data storage.

## Setup Instructions

1. Create a new Supabase project at https://supabase.com

2. Create the tasks table in your Supabase database:

```sql
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  due_date timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  category text not null,
  status text not null,
  user_id uuid references auth.users not null
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Create policy
create policy "Users can only access their own tasks"
  on public.tasks
  for all
  using (auth.uid() = user_id);
```

3. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase project credentials:
   - Get your project URL and anon key from Project Settings > API
   - Replace the placeholder values in `.env`

## Development

```bash
npm install
npm run dev
```

## Features

- Authentication with email/password
- Real-time task updates
- Drag-and-drop task management
- Task categorization and sorting
- Due date tracking
- Responsive design