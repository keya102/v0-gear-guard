-- Fix equipment ID to auto-generate UUID instead of requiring manual TEXT input
-- This migration changes the equipments.id from TEXT to UUID with auto-generation

-- Step 1: Create a temporary new table with UUID id
CREATE TABLE IF NOT EXISTS equipments_new (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES equipment_categories(id) ON DELETE SET NULL,
  department TEXT NOT NULL,
  location TEXT,
  status TEXT CHECK (status IN ('operational', 'maintenance', 'scrapped', 'offline')) DEFAULT 'operational',
  purchase_date DATE,
  warranty_expiry DATE,
  cost DECIMAL(12, 2),
  serial_number TEXT,
  manufacturer TEXT,
  model TEXT,
  specifications JSONB,
  notes TEXT,
  is_scrapped BOOLEAN DEFAULT FALSE,
  scrapped_at TIMESTAMP WITH TIME ZONE,
  scrapped_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Drop the old table (if it exists with data, you'll need to migrate it first)
-- WARNING: This will delete existing equipment data. If you have data, contact support.
DROP TABLE IF EXISTS equipments CASCADE;

-- Step 3: Rename the new table to equipments
ALTER TABLE equipments_new RENAME TO equipments;

-- Step 4: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_equipments_department ON equipments(department);
CREATE INDEX IF NOT EXISTS idx_equipments_status ON equipments(status);
CREATE INDEX IF NOT EXISTS idx_equipments_category ON equipments(category_id);

-- Step 5: Recreate the updated_at trigger
CREATE TRIGGER update_equipments_updated_at BEFORE UPDATE ON equipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: You'll need to recreate maintenance_requests table to reference the new UUID
-- Let's also fix that table

DROP TABLE IF EXISTS maintenance_request_history CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;

-- Recreate maintenance_requests with UUID equipment_id
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  request_type TEXT CHECK (request_type IN ('corrective', 'preventive', 'inspection')) NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('new', 'in_progress', 'repaired', 'scrap')) DEFAULT 'new',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  team_id UUID REFERENCES maintenance_teams(id) ON DELETE SET NULL,
  scheduled_date DATE,
  due_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  estimated_hours DECIMAL(6, 2),
  actual_hours DECIMAL(6, 2),
  cost DECIMAL(12, 2),
  parts_used JSONB,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate maintenance_request_history
CREATE TABLE IF NOT EXISTS maintenance_request_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  old_assigned_to UUID,
  new_assigned_to UUID,
  changes JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_assigned ON maintenance_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_due_date ON maintenance_requests(due_date);
CREATE INDEX IF NOT EXISTS idx_request_history_request ON maintenance_request_history(request_id);

-- Recreate triggers
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Recreate the view for overdue requests
CREATE OR REPLACE VIEW maintenance_requests_with_overdue AS
SELECT 
  *,
  CASE 
    WHEN status NOT IN ('repaired', 'scrap') AND due_date < CURRENT_DATE THEN TRUE
    ELSE FALSE
  END AS is_overdue
FROM maintenance_requests;
