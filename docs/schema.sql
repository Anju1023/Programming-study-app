-- Users Table (Profiles)
-- Supabase Authのusersテーブルと連動
create table if not exists public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  email text,
  username text unique,
  avatar_url text,
  xp integer default 0,
  streak integer default 0,
  hearts integer default 5,
  last_active_at timestamptz default timezone('utc'::text, now()),
  created_at timestamptz default timezone('utc'::text, now())
);

-- RLS Policies for Profiles
alter table public.profiles enable row level security;

-- Policies (Wrapped in do blocks to prevent "already exists" errors)
do $$ begin
  create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
exception when others then null; end $$;

do $$ begin
  create policy "Users can insert their own profile." on public.profiles for insert with check ( auth.uid() = id );
exception when others then null; end $$;

do $$ begin
  create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );
exception when others then null; end $$;

-- Courses Table
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  order_index integer not null default 0,
  created_at timestamptz default timezone('utc'::text, now())
);

-- Units Table
create table if not exists public.units (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamptz default timezone('utc'::text, now())
);

-- Lessons Table
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  unit_id uuid references public.units(id) on delete cascade not null,
  title text not null,
  type text not null, -- 'lecture', 'quiz', 'boss'
  order_index integer not null default 0,
  content jsonb, -- クイズデータなどを格納
  xp_reward integer default 10,
  created_at timestamptz default timezone('utc'::text, now())
);

-- User Progress Table
create table if not exists public.user_progress (
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  status text not null default 'locked', -- 'locked', 'active', 'completed'
  score integer,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

alter table public.user_progress enable row level security;

do $$ begin
  create policy "Users can view own progress" on public.user_progress for select using ( auth.uid() = user_id );
exception when others then null; end $$;

do $$ begin
  create policy "Users can insert own progress" on public.user_progress for insert with check ( auth.uid() = user_id );
exception when others then null; end $$;

do $$ begin
  create policy "Users can update own progress" on public.user_progress for update using ( auth.uid() = user_id );
exception when others then null; end $$;

-- Handle new user creation trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
