-- =====================================================
-- STEP 1: Clean up old data (run this first)
-- =====================================================

-- Delete old transactions and settings without user_id
DELETE FROM transactions WHERE id IS NOT NULL;
DELETE FROM settings WHERE id IS NOT NULL;

-- =====================================================
-- STEP 2: Migration - Add Authentication and User Isolation
-- =====================================================

-- Drop old public access policies
DROP POLICY IF EXISTS "Public Access Transactions" ON transactions;
DROP POLICY IF EXISTS "Public Access Settings" ON settings;

-- Add user_id columns to existing tables
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE settings DROP CONSTRAINT IF EXISTS single_row;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make settings table support multiple users (one row per user)
ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_pkey;
ALTER TABLE settings ADD PRIMARY KEY (user_id);

-- =====================================================
-- STEP 3: Create RLS policies for authenticated users
-- =====================================================

-- Transactions: Users can only see their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Settings: Users can only see and modify their own settings
CREATE POLICY "Users can view own settings"
  ON settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON settings FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- STEP 4: Create trigger to auto-create settings for new users
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.settings (user_id, ledger_name, family_members)
  VALUES (new.id, 'Dad', '["Me", "Mom", "Dad"]'::jsonb);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
