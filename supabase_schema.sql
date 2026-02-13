-- Create a table for transactions
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  description text not null,
  amount numeric not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  category text,
  type text not null, -- 'expense', 'income', 'dad_loan', 'dad_repayment'
  borrower text,
  is_dad_related boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for app settings (ledger name, family members)
-- We'll use a single row for global settings since this is a simple personal app
create table settings (
  id int primary key default 1,
  ledger_name text default 'Dad',
  family_members jsonb default '["Alex", "Sarah", "Mom", "Dad"]'::jsonb,
  constraint single_row check (id = 1)
);

-- Insert initial settings if not exists
insert into settings (id, ledger_name, family_members)
values (1, 'Dad', '["Alex", "Sarah", "Mom", "Dad"]'::jsonb)
on conflict (id) do nothing;

-- Enable Row Level Security (RLS) is recommended, but for this simple demo with public key
-- and no user authentication (just API key), we might need to enable public access.
-- Steps to enable public access (if not using Auth):
-- 1. Go to Authentication > Providers > Disable all if not needed.
-- 2. Go to Table Editor > transactions > policies.
-- 3. Create a policy "Enable read/write for all" (if unsafe is okay for this demo).
--    USING (true) WITH CHECK (true) for SELECT, INSERT, UPDATE, DELETE.
--    IMPORTANT: For a real app, use Auth and RLS properly!

-- Policy example for public access (RUN THIS IF YOU WANT IT TO WORK WIHTOUT LOGIN):
alter table transactions enable row level security;
create policy "Public Access Transactions" on transactions for all using (true) with check (true);

alter table settings enable row level security;
create policy "Public Access Settings" on settings for all using (true) with check (true);
