-- OpsFlow MVP schema
-- Run this in the Supabase SQL Editor, then run supabase/seed.sql for demo data.

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to uuid references public.employees(id) on delete set null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'completed')),
  due_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_assigned_to_idx on public.tasks(assigned_to);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- Open access for hackathon MVP (no auth). Anyone with the anon key can read/write.
alter table public.employees enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "Allow all employees" on public.employees;
create policy "Allow all employees" on public.employees
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow all tasks" on public.tasks;
create policy "Allow all tasks" on public.tasks
  for all to anon, authenticated using (true) with check (true);

grant select, insert, update, delete on public.employees to anon, authenticated;
grant select, insert, update, delete on public.tasks to anon, authenticated;
