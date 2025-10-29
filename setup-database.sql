-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/dvddjqfbcxrzaiqqxehu/sql/new

-- Create the calculator_history table
CREATE TABLE IF NOT EXISTS calculator_history (
  id BIGSERIAL PRIMARY KEY,
  calculation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE calculator_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
-- Note: This allows anyone to read/write. For production, you should restrict this.
CREATE POLICY "Enable all operations for calculator_history"
ON calculator_history
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_calculator_history_created_at
ON calculator_history(created_at DESC);

-- Verify the table was created
SELECT * FROM calculator_history LIMIT 5;
