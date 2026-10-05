-- ============================================================
-- Twin Towers Community App — schema
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text,
  flat        text,
  tower       text check (tower in ('Tower A', 'Tower B')),
  phone       text,
  email       text,
  role        text not null default 'resident' check (role in ('resident', 'committee', 'admin')),
  created_at  timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, phone, email)
  values (new.id, new.phone, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Core members ────────────────────────────────────────────
create table public.core_members (
  id               text primary key,
  name             text not null,
  role             text not null,
  team             text not null,
  tower            text not null,
  flat             text not null,
  phone            text not null,
  email            text not null,
  responsibilities text[] not null default '{}',
  avatar           text not null,
  sort             int not null default 0
);

-- ── Maintenance ─────────────────────────────────────────────
create table public.maintenance_items (
  id               text primary key,
  category         text not null,
  subcategory      text not null,
  name             text not null,
  status           text not null check (status in ('Good', 'Fair', 'Poor', 'Out of service')),
  last_inspected   date not null,
  next_check       date not null,
  assigned_to      text not null,
  warranty_expiry  date,
  notes            text not null default '',
  sort             int not null default 0
);

create table public.maintenance_history (
  id         bigint generated always as identity primary key,
  item_id    text not null references public.maintenance_items (id) on delete cascade,
  date       date not null,
  status     text not null,
  note       text not null,
  inspector  text not null
);
create index on public.maintenance_history (item_id);

-- ── Issues ──────────────────────────────────────────────────
create sequence public.issue_number_seq start 11;

create table public.issues (
  id              text primary key default ('TT-' || lpad(nextval('public.issue_number_seq')::text, 3, '0')),
  category        text not null,
  subcategory     text not null,
  priority        text not null check (priority in ('High', 'Medium', 'Low')),
  status          text not null default 'Open' check (status in ('Open', 'In Progress', 'Resolved', 'On Hold', 'Closed')),
  raised_by       uuid references public.profiles (id) on delete set null default auth.uid(),
  raised_by_name  text not null,
  flat            text not null default '',
  assigned_to     text not null default 'Unassigned',
  area            text not null,
  description     text not null check (length(description) between 5 and 2000),
  sla             date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index on public.issues (raised_by);

create table public.issue_comments (
  id          bigint generated always as identity primary key,
  issue_id    text not null references public.issues (id) on delete cascade,
  author_id   uuid references public.profiles (id) on delete set null default auth.uid(),
  author_name text not null,
  body        text not null check (length(body) between 1 and 2000),
  created_at  timestamptz not null default now()
);
create index on public.issue_comments (issue_id);

-- ── Cultural ────────────────────────────────────────────────
create table public.events (
  id               text primary key,
  name             text not null,
  date             date not null,
  time_label       text not null,
  location         text not null,
  organizer        text not null,
  description      text not null,
  registered_base  int not null default 0,
  capacity         int not null,
  status           text not null check (status in ('upcoming', 'planning', 'past')),
  category         text not null
);

create table public.event_registrations (
  event_id    text not null references public.events (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  created_at  timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table public.proposals (
  id             text primary key,
  name           text not null,
  proposed_by    text not null,
  flat           text not null,
  description    text not null,
  budget         int,
  proposed_date  date,
  status         text not null check (status in ('approved', 'under_review', 'pending')),
  approved_by    text,
  votes_yes      int not null default 0,
  votes_no       int not null default 0
);

create table public.gallery_albums (
  id           bigint generated always as identity primary key,
  name         text not null,
  photo_count  int not null,
  date_label   text not null,
  emoji        text not null,
  hue          int not null,
  sort         int not null default 0
);

-- ── Facilities & bookings ───────────────────────────────────
create table public.facilities (
  id            text primary key,
  name          text not null unique,
  icon          text not null,
  slots         int not null,
  max_duration  int not null,
  buffer        int not null,
  charges       text not null,
  rules         text[] not null default '{}',
  sort          int not null default 0
);

create sequence public.booking_number_seq start 2848;

create table public.bookings (
  id           text primary key default ('TT-BK-' || nextval('public.booking_number_seq')::text),
  facility_id  text not null references public.facilities (id),
  date         date not null,
  start_time   time not null,
  end_time     time not null,
  user_id      uuid references public.profiles (id) on delete cascade default auth.uid(),
  booked_by    text not null,
  flat         text not null default '',
  status       text not null default 'confirmed' check (status in ('confirmed', 'blocked', 'cancelled')),
  purpose      text,
  created_at   timestamptz not null default now(),
  check (end_time > start_time)
);
-- One active booking per facility slot
create unique index bookings_slot_unique
  on public.bookings (facility_id, date, start_time)
  where status <> 'cancelled';
create index on public.bookings (user_id);

-- ── Policies & rules ────────────────────────────────────────
create table public.community_policies (
  id        text primary key,
  category  text not null,
  icon      text not null,
  rules     text[] not null default '{}',
  sort      int not null default 0
);

-- ── Polls ───────────────────────────────────────────────────
create table public.polls (
  id               text primary key,
  title            text not null,
  description      text not null,
  start_date       date not null,
  end_date         date not null,
  eligible_voters  text not null,
  options          text[] not null,
  base_votes       int[] not null,
  total_eligible   int not null,
  status           text not null check (status in ('active', 'upcoming', 'closed')),
  check (array_length(options, 1) = array_length(base_votes, 1))
);

create table public.poll_votes (
  poll_id     text not null references public.polls (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  option_idx  int not null check (option_idx >= 0),
  created_at  timestamptz not null default now(),
  primary key (poll_id, user_id)
);

-- ── Notifications ───────────────────────────────────────────
create table public.notifications (
  id          text primary key default gen_random_uuid()::text,
  user_id     uuid references public.profiles (id) on delete cascade,  -- null = broadcast
  type        text not null check (type in ('issue', 'maintenance', 'booking', 'poll', 'event', 'alert')),
  title       text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);
create index on public.notifications (user_id);

create table public.notification_reads (
  notification_id  text not null references public.notifications (id) on delete cascade,
  user_id          uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  read_at          timestamptz not null default now(),
  primary key (notification_id, user_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles             enable row level security;
alter table public.core_members         enable row level security;
alter table public.maintenance_items    enable row level security;
alter table public.maintenance_history  enable row level security;
alter table public.issues               enable row level security;
alter table public.issue_comments       enable row level security;
alter table public.events               enable row level security;
alter table public.event_registrations  enable row level security;
alter table public.proposals            enable row level security;
alter table public.gallery_albums       enable row level security;
alter table public.facilities           enable row level security;
alter table public.bookings             enable row level security;
alter table public.community_policies   enable row level security;
alter table public.polls                enable row level security;
alter table public.poll_votes           enable row level security;
alter table public.notifications        enable row level security;
alter table public.notification_reads   enable row level security;

-- Profiles: residents see and edit only their own row (role is not self-editable)
create policy "own profile read"   on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "own profile update" on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
revoke update on public.profiles from authenticated;
grant update (name, flat, tower, email) on public.profiles to authenticated;

-- Community reference data: readable by any signed-in resident
create policy "read" on public.core_members        for select to authenticated using (true);
create policy "read" on public.maintenance_items   for select to authenticated using (true);
create policy "read" on public.maintenance_history for select to authenticated using (true);
create policy "read" on public.events              for select to authenticated using (true);
create policy "read" on public.proposals           for select to authenticated using (true);
create policy "read" on public.gallery_albums      for select to authenticated using (true);
create policy "read" on public.facilities          for select to authenticated using (true);
create policy "read" on public.community_policies  for select to authenticated using (true);
create policy "read" on public.polls               for select to authenticated using (true);

-- Issues: community-visible; residents raise their own
create policy "read" on public.issues for select to authenticated using (true);
create policy "raise own" on public.issues for insert to authenticated
  with check ((select auth.uid()) = raised_by and status = 'Open' and assigned_to = 'Unassigned');

create policy "read" on public.issue_comments for select to authenticated using (true);
create policy "comment as self" on public.issue_comments for insert to authenticated
  with check ((select auth.uid()) = author_id);

-- Event registrations: own rows only (counts come from events_with_counts)
create policy "own read"   on public.event_registrations for select to authenticated using ((select auth.uid()) = user_id);
create policy "own insert" on public.event_registrations for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own delete" on public.event_registrations for delete to authenticated using ((select auth.uid()) = user_id);

-- Bookings: residents see their own; slot availability via taken_slots()
create policy "own read" on public.bookings for select to authenticated using ((select auth.uid()) = user_id);
create policy "own insert" on public.bookings for insert to authenticated
  with check ((select auth.uid()) = user_id and status = 'confirmed');

-- Poll votes: anonymous — only your own vote is visible; one vote, active polls only
create policy "own read" on public.poll_votes for select to authenticated using ((select auth.uid()) = user_id);
create policy "vote once on active poll" on public.poll_votes for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.polls p
      where p.id = poll_id
        and p.status = 'active'
        and option_idx < array_length(p.options, 1)
    )
  );

-- Notifications: broadcast + personal
create policy "read" on public.notifications for select to authenticated
  using (user_id is null or (select auth.uid()) = user_id);
create policy "own read"   on public.notification_reads for select to authenticated using ((select auth.uid()) = user_id);
create policy "own insert" on public.notification_reads for insert to authenticated with check ((select auth.uid()) = user_id);

-- ============================================================
-- Aggregates (expose counts without exposing who)
-- ============================================================
create function public.poll_results()
returns table (poll_id text, votes int[])
language sql
stable
security definer
set search_path = ''
as $$
  select p.id,
         array(
           select p.base_votes[i] + coalesce((
             select count(*)::int from public.poll_votes v
             where v.poll_id = p.id and v.option_idx = i - 1
           ), 0)
           from generate_subscripts(p.options, 1) as i
           order by i
         )
  from public.polls p;
$$;

create function public.event_counts()
returns table (event_id text, registered int)
language sql
stable
security definer
set search_path = ''
as $$
  select e.id,
         e.registered_base + (select count(*)::int from public.event_registrations r where r.event_id = e.id)
  from public.events e;
$$;

create function public.taken_slots(p_facility_id text, p_from date, p_to date)
returns table (date date, start_time time)
language sql
stable
security definer
set search_path = ''
as $$
  select b.date, b.start_time
  from public.bookings b
  where b.facility_id = p_facility_id
    and b.date between p_from and p_to
    and b.status <> 'cancelled';
$$;

revoke execute on function public.poll_results()                 from public, anon;
revoke execute on function public.event_counts()                 from public, anon;
revoke execute on function public.taken_slots(text, date, date)  from public, anon;
grant  execute on function public.poll_results()                 to authenticated;
grant  execute on function public.event_counts()                 to authenticated;
grant  execute on function public.taken_slots(text, date, date)  to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
