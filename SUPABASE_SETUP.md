# Supabase Setup Instructions

This calculator app uses Supabase to store calculation history. Follow these steps to complete the setup:

## 1. Create Supabase Table

In your Supabase project, run this SQL query to create the `calculator_history` table:

```sql
CREATE TABLE calculator_history (
  id BIGSERIAL PRIMARY KEY,
  calculation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE calculator_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this for your needs)
CREATE POLICY "Enable all operations for calculator_history" ON calculator_history
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_calculator_history_created_at ON calculator_history(created_at DESC);
```

## 2. Configure Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:
   - `SUPABASE_URL`: Your Supabase project URL (found in Settings → API)
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key (found in Settings → API)

## 3. Update config.js (if needed)

If you want to hardcode your Supabase credentials (not recommended for production), update `config.js`:

```javascript
const SUPABASE_URL = 'your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

## Features

- **Persistent History**: All calculations are automatically saved to Supabase
- **Cross-Device Sync**: Access your history from any device
- **Automatic Loading**: History is loaded when you open the calculator
- **Clear History**: Delete all history with one click

## Notes

- The calculator stores up to 20 most recent calculations
- History is ordered by most recent first
- If Supabase is not configured, the app will still work with local-only history
