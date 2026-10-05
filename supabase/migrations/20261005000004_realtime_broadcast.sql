-- Live updates: any write to community data broadcasts a tiny "changed" signal on
-- the private Realtime topic `community`. The payload is only the table name, so
-- nothing personal leaks; each app then refetches through its own RLS-filtered
-- queries (e.g. a neighbour's booking only greys out the slot via taken_slots()).

create function public.broadcast_community_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.send(
    jsonb_build_object('table', tg_table_name),
    'change',
    'community',
    true  -- private: only subscribers allowed by the realtime.messages policy below
  );
  return null;
end;
$$;

revoke execute on function public.broadcast_community_change() from public, anon, authenticated;

-- One signal per statement (not per row) keeps bulk committee edits cheap.
do $$
declare
  t text;
begin
  foreach t in array array[
    'issues', 'issue_comments', 'bookings', 'poll_votes', 'polls', 'event_registrations',
    'events', 'proposals', 'gallery_albums', 'maintenance_items', 'maintenance_history',
    'facilities', 'community_policies', 'core_members', 'notifications'
  ] loop
    execute format(
      'create trigger broadcast_change after insert or update or delete on public.%I
         for each statement execute function public.broadcast_community_change()', t);
  end loop;
end $$;

-- Signed-in residents may listen on `community`; nobody may send on it from the
-- client (no insert policy), so only the database can trigger refreshes.
create policy "residents receive community updates"
  on realtime.messages for select to authenticated
  using (realtime.topic() = 'community' and extension = 'broadcast');
