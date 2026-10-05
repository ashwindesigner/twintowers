-- Personal notifications: booking confirmations and comments on your tickets.

create function public.notify_booking_confirmed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  fac text;
begin
  if new.user_id is null then
    return new;
  end if;
  select name into fac from public.facilities where id = new.facility_id;
  insert into public.notifications (user_id, type, title, message)
  values (
    new.user_id, 'booking', 'Booking Confirmed',
    fac || ' booked for ' || to_char(new.date, 'Mon FMDD') || ', '
      || to_char(new.start_time, 'FMHH24:MI') || '–' || to_char(new.end_time, 'FMHH24:MI')
      || '. Booking ID: ' || new.id || '.'
  );
  return new;
end;
$$;

create trigger on_booking_created
  after insert on public.bookings
  for each row execute function public.notify_booking_confirmed();

create function public.notify_issue_comment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner uuid;
begin
  select raised_by into owner from public.issues where id = new.issue_id;
  if owner is null or owner = new.author_id then
    return new;
  end if;
  insert into public.notifications (user_id, type, title, message)
  values (
    owner, 'issue', 'Your ticket ' || new.issue_id || ' updated',
    new.author_name || ' added a comment: ''' || left(new.body, 120) || ''''
  );
  update public.issues set updated_at = now() where id = new.issue_id;
  return new;
end;
$$;

create trigger on_issue_comment_created
  after insert on public.issue_comments
  for each row execute function public.notify_issue_comment();

revoke execute on function public.notify_booking_confirmed() from public, anon, authenticated;
revoke execute on function public.notify_issue_comment()     from public, anon, authenticated;
