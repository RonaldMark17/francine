-- Run once in Supabase Dashboard > SQL Editor before importing data.
create table if not exists public.app_records (
  bucket text not null,
  record_id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (bucket, record_id)
);

create index if not exists app_records_bucket_idx on public.app_records (bucket);

alter table public.app_records enable row level security;
revoke all on public.app_records from anon, authenticated;
grant all on public.app_records to service_role;

create or replace function public.increment_app_record_field(
  p_bucket text,
  p_record_id text,
  p_field_name text
) returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  update public.app_records as r
  set payload = case
    when p_bucket = 'promotionsList' and p_field_name = 'usageCount' then
      jsonb_set(
        jsonb_set(r.payload, '{usageCount}', to_jsonb(coalesce((r.payload->>'usageCount')::integer, (r.payload->>'times_used')::integer, 0) + 1), true),
        '{times_used}', to_jsonb(coalesce((r.payload->>'usageCount')::integer, (r.payload->>'times_used')::integer, 0) + 1), true
      )
    else jsonb_set(r.payload, array[p_field_name], to_jsonb(coalesce((r.payload->>p_field_name)::integer, 0) + 1), true)
  end,
  updated_at = now()
  where r.bucket = p_bucket and r.record_id = p_record_id;
end;
$$;

create or replace function public.adjust_app_product_stock(
  p_product_id text,
  p_change_amount integer
) returns table(previous_stock integer, new_stock integer, product_name text)
language plpgsql
security invoker
set search_path = public
as $$
begin
  return query
  with prior as (
    select r.record_id, coalesce((r.payload->>'stock')::integer, 0) as old_stock
    from public.app_records as r
    where r.bucket = 'products' and r.record_id = p_product_id
    for update
  ), updated as (
    update public.app_records as r
    set payload = jsonb_set(r.payload, '{stock}', to_jsonb(greatest(0, prior.old_stock + p_change_amount)), true),
        updated_at = now()
    from prior
    where r.bucket = 'products' and r.record_id = prior.record_id
    returning prior.old_stock, r.payload
  )
  select updated.old_stock, coalesce((updated.payload->>'stock')::integer, 0), updated.payload->>'name'
  from updated;
end;
$$;

revoke all on function public.increment_app_record_field(text, text, text) from public, anon, authenticated;
revoke all on function public.adjust_app_product_stock(text, integer) from public, anon, authenticated;
grant execute on function public.increment_app_record_field(text, text, text) to service_role;
grant execute on function public.adjust_app_product_stock(text, integer) to service_role;
