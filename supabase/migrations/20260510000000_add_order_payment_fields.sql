-- Add customer-level payment fields used by the dashboard order dialogs.
-- Safe to run on an existing Supabase project.

alter table public.orders
  add column if not exists downpayment numeric default 0,
  add column if not exists payment_method text;

alter table public.trash_orders
  add column if not exists downpayment numeric default 0,
  add column if not exists payment_method text;
