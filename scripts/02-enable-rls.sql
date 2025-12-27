-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_request_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Equipment categories policies (everyone can read, only admins can modify)
CREATE POLICY "Anyone can view equipment categories"
  ON equipment_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert equipment categories"
  ON equipment_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update equipment categories"
  ON equipment_categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Equipments policies (everyone can read, techs+ can modify)
CREATE POLICY "Anyone can view equipments"
  ON equipments FOR SELECT
  USING (true);

CREATE POLICY "Technicians can create equipments"
  ON equipments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'technician')
    )
  );

CREATE POLICY "Technicians can update equipments"
  ON equipments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'technician')
    )
  );

-- Maintenance teams policies
CREATE POLICY "Anyone can view maintenance teams"
  ON maintenance_teams FOR SELECT
  USING (true);

CREATE POLICY "Managers can create maintenance teams"
  ON maintenance_teams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Managers can update maintenance teams"
  ON maintenance_teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Team members policies
CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  USING (true);

CREATE POLICY "Managers can manage team members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Maintenance requests policies
CREATE POLICY "Anyone can view maintenance requests"
  ON maintenance_requests FOR SELECT
  USING (true);

CREATE POLICY "Technicians can create maintenance requests"
  ON maintenance_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'technician')
    )
  );

CREATE POLICY "Technicians can update maintenance requests"
  ON maintenance_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'technician')
    )
  );

-- Maintenance request history policies (read-only for most, system creates records)
CREATE POLICY "Anyone can view maintenance history"
  ON maintenance_request_history FOR SELECT
  USING (true);

CREATE POLICY "System can insert maintenance history"
  ON maintenance_request_history FOR INSERT
  WITH CHECK (true);
