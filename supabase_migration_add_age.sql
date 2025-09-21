-- Add age column to profiles table
ALTER TABLE profiles ADD COLUMN age INTEGER CHECK (age >= 10 AND age <= 120);

-- Add comment to the column
COMMENT ON COLUMN profiles.age IS 'User age in years (10-120)';

-- Update the updated_at timestamp for any future changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure the trigger exists for the profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();