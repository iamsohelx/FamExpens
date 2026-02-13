# 🚨 URGENT: Run Database Migration

You're getting the error because the `user_id` column doesn't exist in your database yet. Follow these steps:

## Step 1: Open Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/cpybrgxgzrgsoqkdugva)
2. Click on **SQL Editor** in the left sidebar (icon looks like `>_`)
3. Click **New Query**

## Step 2: Copy and Run the Migration

1. Open the file `supabase_migration_auth.sql` from your project folder
2. **Copy ALL the contents** (Ctrl+A, Ctrl+C)
3. **Paste** into the Supabase SQL Editor
4. Click **Run** button (or press F5)

You should see: ✅ **Success. No rows returned**

## Step 3: Verify Tables Updated

After running the migration, you can verify it worked:

1. In Supabase Dashboard, go to **Table Editor** → **transactions**
2. Check that there's now a `user_id` column
3. Go to **Table Editor** → **settings**  
4. Check that there's now a `user_id` column

## Step 4: Test the App

1. Refresh your app
2. Try adding a transaction
3. It should save successfully!

---

## What the Migration Does

- ✅ Adds `user_id` column to `transactions` table
- ✅ Adds `user_id` column to `settings` table  
- ✅ Removes old public access policies
- ✅ Creates new Row Level Security policies (users only see their own data)
- ✅ Adds trigger to auto-create settings for new users

---

## Troubleshooting

**If you get errors about existing data:**

You might have old transactions/settings without a user_id. Run this in SQL Editor to clean them up:

```sql
DELETE FROM transactions WHERE user_id IS NULL;
DELETE FROM settings WHERE user_id IS NULL;
```

Then try the migration again.
