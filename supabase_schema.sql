-- Run this in your Supabase SQL Editor

-- 1. Extend Users table (NextAuth adapter creates the basics, we add career-specific fields)
-- Note: Ensure NextAuth adapter has already run or created the users table.
ALTER TABLE users ADD COLUMN IF NOT EXISTS target_role TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_role TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_done BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';

-- 2. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  template TEXT DEFAULT 'modern',
  ats_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Cover Letters Table
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  job_title TEXT, 
  company TEXT, 
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  role TEXT, 
  company TEXT, 
  type TEXT,
  messages JSONB DEFAULT '[]',
  overall_score INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Career Roadmaps Table
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  current_role TEXT, 
  target_role TEXT,
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Activity Log (for dashboard recent activity feed)
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Enable Row Level Security (RLS) on all tables
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies (Ensure users can only see their own data)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_resumes') THEN
        CREATE POLICY "own_resumes" ON resumes FOR ALL USING (user_id = auth.uid()::text);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_letters') THEN
        CREATE POLICY "own_letters" ON cover_letters FOR ALL USING (user_id = auth.uid()::text);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_sessions') THEN
        CREATE POLICY "own_sessions" ON interview_sessions FOR ALL USING (user_id = auth.uid()::text);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_roadmaps') THEN
        CREATE POLICY "own_roadmaps" ON roadmaps FOR ALL USING (user_id = auth.uid()::text);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_activity') THEN
        CREATE POLICY "own_activity" ON activity_log FOR ALL USING (user_id = auth.uid()::text);
    END IF;
END $$;
