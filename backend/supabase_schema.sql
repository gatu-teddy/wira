-- ============================================================
-- Wira Database Schema
-- Run this in the Supabase SQL editor (Project > SQL Editor)
-- ============================================================

-- ── Profiles (extends auth.users with role + employer info) ───────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('seeker', 'employer', 'admin')),
  full_name   text,
  company_name    text,      -- employers only
  company_website text,
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Skills reference list ─────────────────────────────────────────
create table if not exists skills (
  id       serial primary key,
  name     text not null unique,
  category text,             -- e.g. "Engineering", "Design", "Finance"
  created_at timestamptz default now()
);

-- ── Candidates (seeker profiles, built from resume parsing) ───────
create table if not exists candidates (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade unique,
  full_name        text,
  email            text,
  phone            text,
  location         text,
  summary          text,
  skills           text[],
  years_experience numeric,
  experience       jsonb default '[]',
  education        jsonb default '[]',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── Jobs ──────────────────────────────────────────────────────────
create table if not exists jobs (
  id                   uuid primary key default gen_random_uuid(),
  employer_id          uuid references auth.users(id) on delete cascade,
  company_name         text not null,
  title                text not null,
  description          text not null,
  required_skills      text[],
  salary_min           integer,
  salary_max           integer,
  salary_currency      text default 'USD',
  location             text,
  remote               boolean default false,
  experience_years_min integer default 0,
  experience_years_max integer default 20,
  is_active            boolean default true,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ── AI Match results ──────────────────────────────────────────────
create table if not exists matches (
  id               uuid primary key default gen_random_uuid(),
  candidate_id     uuid references candidates(id) on delete cascade,
  job_id           uuid references jobs(id) on delete cascade,
  overall_score    numeric,
  skills_score     numeric,
  experience_score numeric,
  key_strengths    text[],
  gaps             text[],
  recommendation   text,
  summary          text,
  created_at       timestamptz default now(),
  unique(candidate_id, job_id)
);

-- ── Applications (candidate applies to job) ───────────────────────
create table if not exists applications (
  id           uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  job_id       uuid references jobs(id) on delete cascade,
  status       text not null default 'applied'
               check (status in ('applied','shortlisted','interviewed','offered','rejected','withdrawn')),
  cover_note   text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique(candidate_id, job_id)
);

-- ── Conversations (messaging threads) ────────────────────────────
create table if not exists conversations (
  id          uuid primary key default gen_random_uuid(),
  seeker_id   uuid references auth.users(id) on delete cascade,
  employer_id uuid references auth.users(id) on delete cascade,
  job_id      uuid references jobs(id) on delete set null,
  created_at  timestamptz default now(),
  unique(seeker_id, employer_id, job_id)
);

-- ── Messages ──────────────────────────────────────────────────────
create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id       uuid references auth.users(id) on delete cascade,
  body            text not null,
  read_at         timestamptz,
  created_at      timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles       enable row level security;
alter table skills         enable row level security;
alter table candidates     enable row level security;
alter table jobs           enable row level security;
alter table matches        enable row level security;
alter table applications   enable row level security;
alter table conversations  enable row level security;
alter table messages       enable row level security;

-- profiles: users manage their own
create policy "profiles_own"
  on profiles using (auth.uid() = id);

-- skills: anyone can read
create policy "skills_read"
  on skills for select using (true);

-- candidates: user manages their own profile
create policy "candidates_own"
  on candidates using (auth.uid() = user_id);

-- jobs: anyone can read active jobs; employer manages their own
create policy "jobs_read"
  on jobs for select using (is_active = true);
create policy "jobs_write"
  on jobs for insert with check (auth.uid() = employer_id);
create policy "jobs_update"
  on jobs for update using (auth.uid() = employer_id);
create policy "jobs_delete"
  on jobs for delete using (auth.uid() = employer_id);

-- matches: candidate sees their own; employer sees for their jobs
create policy "matches_candidate"
  on matches for select using (
    candidate_id in (select id from candidates where user_id = auth.uid())
  );
create policy "matches_employer"
  on matches for select using (
    job_id in (select id from jobs where employer_id = auth.uid())
  );
create policy "matches_insert"
  on matches for insert with check (true);

-- applications: candidate sees their own; employer sees for their jobs
create policy "applications_candidate"
  on applications for select using (
    candidate_id in (select id from candidates where user_id = auth.uid())
  );
create policy "applications_employer"
  on applications for select using (
    job_id in (select id from jobs where employer_id = auth.uid())
  );
create policy "applications_insert"
  on applications for insert with check (
    candidate_id in (select id from candidates where user_id = auth.uid())
  );
create policy "applications_update"
  on applications for update using (
    -- candidate can withdraw; employer can update status
    candidate_id in (select id from candidates where user_id = auth.uid())
    or job_id in (select id from jobs where employer_id = auth.uid())
  );

-- conversations: participants only
create policy "conversations_participant"
  on conversations for select using (
    auth.uid() = seeker_id or auth.uid() = employer_id
  );
create policy "conversations_insert"
  on conversations for insert with check (
    auth.uid() = seeker_id or auth.uid() = employer_id
  );

-- messages: conversation participants only
create policy "messages_read"
  on messages for select using (
    conversation_id in (
      select id from conversations
      where seeker_id = auth.uid() or employer_id = auth.uid()
    )
  );
create policy "messages_insert"
  on messages for insert with check (
    auth.uid() = sender_id
    and conversation_id in (
      select id from conversations
      where seeker_id = auth.uid() or employer_id = auth.uid()
    )
  );

-- ============================================================
-- Seed: common skills
-- ============================================================
insert into skills (name, category) values
  ('Python',            'Engineering'),
  ('JavaScript',        'Engineering'),
  ('TypeScript',        'Engineering'),
  ('React',             'Engineering'),
  ('Node.js',           'Engineering'),
  ('FastAPI',           'Engineering'),
  ('SQL',               'Engineering'),
  ('PostgreSQL',        'Engineering'),
  ('Docker',            'Engineering'),
  ('Kubernetes',        'Engineering'),
  ('AWS',               'Engineering'),
  ('Machine Learning',  'Engineering'),
  ('Data Analysis',     'Analytics'),
  ('Excel',             'Analytics'),
  ('Power BI',          'Analytics'),
  ('Tableau',           'Analytics'),
  ('Financial Modeling','Finance'),
  ('Accounting',        'Finance'),
  ('Project Management','Management'),
  ('Agile',             'Management'),
  ('Scrum',             'Management'),
  ('UI/UX Design',      'Design'),
  ('Figma',             'Design'),
  ('Adobe Photoshop',   'Design'),
  ('Customer Service',  'Operations'),
  ('Sales',             'Operations'),
  ('Marketing',         'Operations'),
  ('Content Writing',   'Operations'),
  ('Logistics',         'Operations'),
  ('Supply Chain',      'Operations'),
  ('Nursing',           'Healthcare'),
  ('Clinical Research', 'Healthcare')
on conflict (name) do nothing;
