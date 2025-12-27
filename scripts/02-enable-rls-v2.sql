-- Drop existing policies first (in case you're re-running)
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Anyone can view equipment categories" ON equipment_categories;
DROP POLICY IF EXISTS "Admins can insert equipment categories" ON equipment_categories;
DROP POLICY IF EXISTS "Admins can update equipment categories" ON equipment_categories;

DROP POLICY IF EXISTS "Anyone can view equipments" ON equipments;
DROP POLICY IF EXISTS "Technicians can create equipments" ON equipments;
DROP POLICY IF EXISTS "Technicians can update equipments" ON equipments;

DROP POLICY IF EXISTS "Anyone can view maintenance teams" ON maintenance_teams;
DROP POLICY IF EXISTS "Managers can create maintenance teams" ON maintenance_teams;
DROP POLICY IF EXISTS "Managers can update maintenance teams" ON maintenance_teams;

DROP POLICY IF EXISTS "Anyone can view team members" ON team_members;
DROP POLICY IF EXISTS "Managers can manage team members" ON team_members;

DROP POLICY IF EXISTS "Anyone can view maintenance requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Technicians can create maintenance requests" ON maintenance_requests;
DROP POLICY IF EXISTS "Technicians can update maintenance requests" ON maintenance_requests;

DROP POLICY IF EXISTS "Anyone can view maintenance history" ON maintenance_request_history;
DROP POLICY IF EXISTS "System can insert maintenance history" ON maintenance_request_history;

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_request_history ENABLE ROW LEVEL SECURITY;

-- Updated profiles policies to allow authenticated users
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow all authenticated users to manage equipment categories
CREATE POLICY "Anyone can view equipment categories"
  ON equipment_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert equipment categories"
  ON equipment_categories FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update equipment categories"
  ON equipment_categories FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete equipment categories"
  ON equipment_categories FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to manage equipments
CREATE POLICY "Anyone can view equipments"
  ON equipments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create equipments"
  ON equipments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update equipments"
  ON equipments FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete equipments"
  ON equipments FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to manage maintenance teams
CREATE POLICY "Anyone can view maintenance teams"
  ON maintenance_teams FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create maintenance teams"
  ON maintenance_teams FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update maintenance teams"
  ON maintenance_teams FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete maintenance teams"
  ON maintenance_teams FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to manage team members
CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage team members"
  ON team_members FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to manage maintenance requests
CREATE POLICY "Anyone can view maintenance requests"
  ON maintenance_requests FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create maintenance requests"
  ON maintenance_requests FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update maintenance requests"
  ON maintenance_requests FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete maintenance requests"
  ON maintenance_requests FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to view and system to insert maintenance history
CREATE POLICY "Anyone can view maintenance history"
  ON maintenance_request_history FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert maintenance history"
  ON maintenance_request_history FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
