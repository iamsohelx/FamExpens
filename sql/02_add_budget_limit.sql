-- Add budget_limit to settings table
ALTER TABLE settings ADD COLUMN IF NOT EXISTS budget_limit numeric DEFAULT 2000;

-- Update existing rows to have default budget (optional, as default covers it for new rows)
UPDATE settings SET budget_limit = 2000 WHERE budget_limit IS NULL;
