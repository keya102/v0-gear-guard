-- Insert sample data for GearGuard application
-- Execute this script to populate the database with initial test data

-- Insert sample profiles (these will be linked to users who sign up)
-- Note: Replace these UUIDs with actual user IDs after users sign up
INSERT INTO profiles (id, full_name, email, role, avatar_url) VALUES
  (gen_random_uuid(), 'John Smith', 'john.smith@gearguard.com', 'technician', '/technician-female.jpg'),
  (gen_random_uuid(), 'Sarah Johnson', 'sarah.johnson@gearguard.com', 'technician', '/engineer-male.jpg'),
  (gen_random_uuid(), 'Mike Davis', 'mike.davis@gearguard.com', 'technician', '/technician-woman.jpg'),
  (gen_random_uuid(), 'Emily Chen', 'emily.chen@gearguard.com', 'manager', '/hardworking-construction-worker.png')
ON CONFLICT (id) DO NOTHING;

-- Insert equipment categories
INSERT INTO equipment_categories (name, description) VALUES
  ('Heavy Machinery', 'Large manufacturing and industrial equipment'),
  ('Material Handling', 'Forklifts, pallet jacks, and conveyor systems'),
  ('Precision Tools', 'CNC machines and precision manufacturing equipment')
ON CONFLICT (name) DO NOTHING;

-- Get category IDs for reference
DO $$
DECLARE
  cat_heavy UUID;
  cat_handling UUID;
  cat_precision UUID;
BEGIN
  SELECT id INTO cat_heavy FROM equipment_categories WHERE name = 'Heavy Machinery' LIMIT 1;
  SELECT id INTO cat_handling FROM equipment_categories WHERE name = 'Material Handling' LIMIT 1;
  SELECT id INTO cat_precision FROM equipment_categories WHERE name = 'Precision Tools' LIMIT 1;

  -- Insert sample equipment
  INSERT INTO equipments (equipment_id, name, department, location, manufacturer, model, serial_number, status, category_id, cost, purchase_date, warranty_expiry) VALUES
    ('EQ-001', 'CNC Machine Pro', 'Manufacturing', 'Building A - Floor 2', 'ACME Corp', 'X-2000', 'SN-2024-001', 'Active', cat_precision, 75000.00, '2023-01-15', '2026-01-15'),
    ('EQ-002', 'Hydraulic Press', 'Manufacturing', 'Building A - Floor 1', 'PowerTech', 'HP-500', 'SN-2024-002', 'Active', cat_heavy, 45000.00, '2023-03-20', '2026-03-20'),
    ('EQ-003', 'Forklift Model X', 'Warehouse', 'Warehouse B - Zone 3', 'LiftCo', 'FL-450', 'SN-2024-003', 'Active', cat_handling, 28000.00, '2023-06-10', '2025-06-10'),
    ('EQ-004', 'Conveyor System', 'Logistics', 'Distribution Center', 'ConveyTech', 'CS-1000', 'SN-2024-004', 'Maintenance', cat_handling, 95000.00, '2022-11-05', '2025-11-05'),
    ('EQ-005', 'Pallet Jack', 'Warehouse', 'Warehouse B - Zone 1', 'LiftCo', 'PJ-200', 'SN-2024-005', 'Active', cat_handling, 3500.00, '2024-02-28', '2027-02-28')
  ON CONFLICT (equipment_id) DO NOTHING;
END $$;

-- Insert maintenance teams
INSERT INTO maintenance_teams (name, department, description, is_active) VALUES
  ('Team Alpha', 'Manufacturing', 'Primary manufacturing maintenance crew', true),
  ('Team Beta', 'Warehouse', 'Warehouse equipment specialists', true),
  ('Team Gamma', 'Logistics', 'Distribution and logistics maintenance', true),
  ('Team Delta', 'Manufacturing', 'Advanced machinery specialists', true)
ON CONFLICT DO NOTHING;

-- Insert maintenance requests (linking to equipment)
DO $$
DECLARE
  eq1_id UUID;
  eq2_id UUID;
  eq3_id UUID;
  eq4_id UUID;
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
  user4_id UUID;
BEGIN
  -- Get equipment IDs
  SELECT id INTO eq1_id FROM equipments WHERE equipment_id = 'EQ-001' LIMIT 1;
  SELECT id INTO eq2_id FROM equipments WHERE equipment_id = 'EQ-002' LIMIT 1;
  SELECT id INTO eq3_id FROM equipments WHERE equipment_id = 'EQ-003' LIMIT 1;
  SELECT id INTO eq4_id FROM equipments WHERE equipment_id = 'EQ-004' LIMIT 1;

  -- Get user IDs (first 4 profiles)
  SELECT id INTO user1_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 0;
  SELECT id INTO user2_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 1;
  SELECT id INTO user3_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 2;
  SELECT id INTO user4_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 3;

  -- Insert maintenance requests
  INSERT INTO maintenance_requests (equipment_id, title, description, request_type, status, priority, scheduled_date, due_date, assigned_to, created_by) VALUES
    (eq1_id, 'Replace hydraulic fluid', 'Routine hydraulic fluid replacement', 'Preventive', 'new', 'medium', '2025-01-15', '2025-01-20', user1_id, user1_id),
    (eq1_id, 'Calibration required', 'Annual calibration check', 'Preventive', 'in-progress', 'high', '2025-01-18', '2025-01-22', user2_id, user2_id),
    (eq1_id, 'Clean cooling system', 'Clean and inspect cooling system', 'Preventive', 'new', 'low', '2025-01-25', '2025-01-28', user1_id, user1_id),
    (eq2_id, 'Pressure valve inspection', 'Inspect and test pressure valves', 'Corrective', 'new', 'high', '2025-01-10', '2025-01-12', user3_id, user3_id),
    (eq3_id, 'Battery replacement', 'Replace forklift battery', 'Preventive', 'repaired', 'medium', '2024-12-15', '2024-12-20', user1_id, user1_id),
    (eq3_id, 'Tire inspection', 'Routine tire inspection', 'Preventive', 'new', 'low', '2025-01-18', '2025-01-25', user2_id, user2_id),
    (eq4_id, 'Belt replacement needed', 'Conveyor belt showing wear', 'Corrective', 'in-progress', 'high', '2025-01-12', '2025-01-18', user4_id, user4_id),
    (eq4_id, 'Motor bearing check', 'Check motor bearings for wear', 'Preventive', 'new', 'medium', '2025-01-22', '2025-01-28', user2_id, user2_id),
    (eq4_id, 'Sensor calibration', 'Calibrate safety sensors', 'Preventive', 'new', 'medium', '2025-01-20', '2025-01-25', user3_id, user3_id),
    (eq4_id, 'Lubrication service', 'Lubricate all moving parts', 'Preventive', 'new', 'low', '2025-01-25', '2025-01-30', user1_id, user1_id),
    (eq4_id, 'Emergency stop test', 'Test emergency stop functionality', 'Preventive', 'new', 'high', '2025-01-28', '2025-02-02', user4_id, user4_id)
  ON CONFLICT DO NOTHING;
END $$;

-- Success message
SELECT 'Sample data inserted successfully!' AS result;
