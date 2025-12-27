-- Fix equipment ID to use auto-generated UUID
-- This script will drop and recreate the equipments table with proper UUID generation

-- First, drop dependent tables and views
DROP VIEW IF EXISTS maintenance_requests_with_overdue CASCADE;
DROP TABLE IF EXISTS maintenance_request_history CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;

-- Drop and recreate equipments table with UUID
DROP TABLE IF EXISTS equipments CASCADE;

CREATE TABLE equipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id UUID REFERENCES equipment_categories(id) ON DELETE SET NULL,
  department TEXT NOT NULL,
  location TEXT,
  purchase_date DATE,
  warranty_expiry DATE,
  status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'maintenance', 'down', 'scrapped')),
  is_scrapped BOOLEAN DEFAULT FALSE,
  scrap_date TIMESTAMPTZ,
  scrap_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate maintenance_requests table
CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipments(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('preventive', 'corrective', 'inspection')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'repaired', 'scrap')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  description TEXT,
  scheduled_date DATE,
  completed_date DATE,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate maintenance_request_history table
CREATE TABLE maintenance_request_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  old_status TEXT,
  new_status TEXT,
  old_assigned_to UUID,
  new_assigned_to UUID,
  change_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate the view
CREATE OR REPLACE VIEW maintenance_requests_with_overdue AS
SELECT 
  mr.*,
  CASE 
    WHEN mr.status NOT IN ('repaired', 'scrap') 
    AND mr.scheduled_date < CURRENT_DATE 
    THEN TRUE 
    ELSE FALSE 
  END AS is_overdue
FROM maintenance_requests mr;

-- Recreate indexes
CREATE INDEX idx_equipments_department ON equipments(department);
CREATE INDEX idx_equipments_status ON equipments(status);
CREATE INDEX idx_equipments_category ON equipments(category_id);
CREATE INDEX idx_maintenance_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_requests_assigned ON maintenance_requests(assigned_to);
CREATE INDEX idx_maintenance_requests_scheduled ON maintenance_requests(scheduled_date);
CREATE INDEX idx_maintenance_history_request ON maintenance_request_history(request_id);

-- Add updated_at trigger for equipments
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_equipments_updated_at
    BEFORE UPDATE ON equipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
    BEFORE UPDATE ON maintenance_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for the recreated tables
ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_request_history ENABLE ROW LEVEL SECURITY;

-- Equipments policies
CREATE POLICY "Allow authenticated users to read equipments"
  ON equipments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert equipments"
  ON equipments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update equipments"
  ON equipments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete equipments"
  ON equipments FOR DELETE
  TO authenticated
  USING (true);

-- Maintenance requests policies
CREATE POLICY "Allow authenticated users to read maintenance requests"
  ON maintenance_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert maintenance requests"
  ON maintenance_requests FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update maintenance requests"
  ON maintenance_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete maintenance requests"
  ON maintenance_requests FOR DELETE
  TO authenticated
  USING (true);

-- Maintenance request history policies
CREATE POLICY "Allow authenticated users to read maintenance history"
  ON maintenance_request_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert maintenance history"
  ON maintenance_request_history FOR INSERT
  TO authenticated
  WITH CHECK (true);
