-- Run this in your Supabase SQL editor to set up the database

create table if not exists candidates (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  location text,
  summary text,
  skills text[],
  years_experience numeric,
  experience jsonb,
  education jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

create table if not exists jobs (
  id uuid primary key,
  employer_id uuid references auth.users(id) on delete cascade,
  company_name text not null,
  title text not null,
  description text not null,
  required_skills text[],
  salary_min integer,
  salary_max integer,
  salary_currency text default 'USD',
  location text,
  remote boolean default false,
  experience_years_min integer default 0,
  experience_years_max integer default 20,
  created_at timestamptz default now()
);

create table if not exists matches (
  id uuid primary key,
  candidate_id uuid references candidates(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  overall_score numeric,
  skills_score numeric,
  experience_score numeric,
  key_strengths text[],
  gaps text[],
  recommendation text,
  summary text,
  created_at timestamptz default now(),
  unique(candidate_id, job_id)
);

-- Row Level Security
alter table candidates enable row level security;
alter table jobs enable row level security;
alter table matches enable row level security;

-- Candidates can read/write their own profile
create policy "candidates_own" on candidates using (auth.uid() = user_id);

-- Anyone can read jobs
create policy "jobs_read" on jobs for select using (true);
-- Employers can write their own jobs
create policy "jobs_write" on jobs for insert with check (auth.uid() = employer_id);
create policy "jobs_delete" on jobs for delete using (auth.uid() = employer_id);

-- Candidates see their own matches, employers see matches for their jobs
create policy "matches_candidate" on matches for select using (
  candidate_id in (select id from candidates where user_id = auth.uid())
);
create policy "matches_employer" on matches for select using (
  job_id in (select id from jobs where employer_id = auth.uid())
);
create policy "matches_insert" on matches for insert with check (true);
