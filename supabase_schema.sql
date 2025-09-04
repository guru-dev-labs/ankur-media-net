-- Supabase schema for Ad Campaign Alerts MVP
-- Run this in Supabase SQL editor

-- campaigns (linked to a user via auth.uid)
create table if not exists campaigns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  platform_campaign_id text, -- external campaign id (Meta)
  created_at timestamptz default now()
);

-- metrics: hourly aggregates
create table if not exists metrics (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references campaigns(id) on delete cascade,
  ts timestamptz not null, -- bucketed hour timestamp
  impressions bigint default 0,
  clicks bigint default 0,
  spend numeric default 0,
  created_at timestamptz default now(),
  unique (campaign_id, ts)
);

-- triggers: user-defined rules
create table if not exists triggers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete cascade,
  metric text not null, -- 'CTR' or 'Spend'
  operator text not null, -- '<' or '>'
  threshold numeric not null,
  duration_hours int default 1, -- window length to evaluate
  name text,
  created_at timestamptz default now(),
  active boolean default true
);

-- alerts: logged events
create table if not exists alerts (
  id uuid default gen_random_uuid() primary key,
  trigger_id uuid references triggers(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  metric text,
  value numeric,
  message text,
  created_at timestamptz default now(),
  notified boolean default false
);
