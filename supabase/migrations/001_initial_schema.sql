-- ============================================================================
-- PlantPulse Database Schema
-- Multi-tenant architecture with app_id isolation
-- ============================================================================

-- ============================================================================
-- SHARED TABLES (no app_id - these are shared across all apps)
-- ============================================================================

CREATE TABLE IF NOT EXISTS app_registry (
  app_id TEXT PRIMARY KEY,
  app_name TEXT NOT NULL,
  app_category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_app_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL REFERENCES app_registry(app_id),
  first_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- APP-ISOLATED TABLES (have app_id column for multi-tenant isolation)
-- ============================================================================

-- Plants - User's plant collection
CREATE TABLE IF NOT EXISTS plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  name TEXT NOT NULL,
  species TEXT,
  nickname TEXT,
  location TEXT,
  photo_url TEXT,
  acquired_date DATE,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Care Schedules - Watering and care schedules
CREATE TABLE IF NOT EXISTS care_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  care_type TEXT NOT NULL CHECK (care_type IN ('water', 'fertilize', 'repot', 'prune', 'mist', 'rotate', 'custom')),
  frequency_days INTEGER NOT NULL,
  last_completed_at TIMESTAMPTZ,
  next_due_at TIMESTAMPTZ,
  reminder_enabled BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Care Logs - History of care actions
CREATE TABLE IF NOT EXISTS care_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  care_type TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plant Health - Health observations
CREATE TABLE IF NOT EXISTS plant_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  health_score INTEGER CHECK (health_score >= 1 AND health_score <= 5),
  issues TEXT[],
  observations TEXT,
  photo_url TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  reminder_time TIME DEFAULT '09:00',
  reminder_enabled BOOLEAN DEFAULT true,
  photo_training_opt_in BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_app_context ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Plants policies
CREATE POLICY "Users can manage own plants" ON plants
  FOR ALL USING (auth.uid() = user_id);

-- Care Schedules policies
CREATE POLICY "Users can manage own schedules" ON care_schedules
  FOR ALL USING (auth.uid() = user_id);

-- Care Logs policies
CREATE POLICY "Users can manage own care logs" ON care_logs
  FOR ALL USING (auth.uid() = user_id);

-- Plant Health policies
CREATE POLICY "Users can manage own health records" ON plant_health
  FOR ALL USING (auth.uid() = user_id);

-- User Settings policies
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- User App Context policies
CREATE POLICY "Users can manage own app context" ON user_app_context
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_plants_user ON plants(user_id);
CREATE INDEX IF NOT EXISTS idx_plants_app_id ON plants(app_id);
CREATE INDEX IF NOT EXISTS idx_care_schedules_plant ON care_schedules(plant_id);
CREATE INDEX IF NOT EXISTS idx_care_schedules_next_due ON care_schedules(next_due_at);
CREATE INDEX IF NOT EXISTS idx_care_logs_plant ON care_logs(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_health_plant ON plant_health(plant_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- REGISTER APP
-- ============================================================================

INSERT INTO app_registry (app_id, app_name, app_category)
VALUES ('plantpulse', 'PlantPulse', 'lifestyle')
ON CONFLICT (app_id) DO NOTHING;
