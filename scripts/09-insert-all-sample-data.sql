-- Complete sample data insertion for GearGuard
-- Execute this script to populate all tables with sample data
-- This script is safe to run multiple times (uses ON CONFLICT)

-- Step 1: Insert Equipment Categories
INSERT INTO equipment_categories (name, description, icon) VALUES
  ('Heavy Machinery', 'Large manufacturing and industrial equipment', '⚙️'),
  ('Material Handling', 'Forklifts, pallet jacks, and conveyor systems', '🏗️'),
  ('Precision Tools', 'CNC machines and precision manufacturing equipment', '🔧')
ON CONFLICT (name) DO NOTHING;

-- Step 2: Insert Sample Equipment
DO $$
DECLARE
  cat_heavy_id UUID;
  cat_handling_id UUID;
  cat_precision_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_heavy_id FROM equipment_categories WHERE name = 'Heavy Machinery' LIMIT 1;
  SELECT id INTO cat_handling_id FROM equipment_categories WHERE name = 'Material Handling' LIMIT 1;
  SELECT id INTO cat_precision_id FROM equipment_categories WHERE name = 'Precision Tools' LIMIT 1;

  -- Insert equipment
  INSERT INTO equipments (equipment_id, name, department, location, manufacturer, model, serial_number, status, category_id, cost, purchase_date, warranty_expiry, is_scrapped) VALUES
    ('EQ-001', 'CNC Machine Pro', 'Manufacturing', 'Building A - Floor 2', 'ACME Corp', 'X-2000', 'SN-2024-001', 'Active', cat_precision_id, 75000.00, '2023-01-15', '2026-01-15', false),
    ('EQ-002', 'Hydraulic Press', 'Manufacturing', 'Building A - Floor 1', 'PowerTech', 'HP-500', 'SN-2024-002', 'Active', cat_heavy_id, 45000.00, '2023-03-20', '2026-03-20', false),
    ('EQ-003', 'Forklift Model X', 'Warehouse', 'Warehouse B - Zone 3', 'LiftCo', 'FL-450', 'SN-2024-003', 'Active', cat_handling_id, 28000.00, '2023-06-10', '2025-06-10', false),
    ('EQ-004', 'Conveyor System', 'Logistics', 'Distribution Center', 'ConveyTech', 'CS-1000', 'SN-2024-004', 'Maintenance', cat_handling_id, 95000.00, '2022-11-05', '2025-11-05', false),
    ('EQ-005', 'Pallet Jack', 'Warehouse', 'Warehouse B - Zone 1', 'LiftCo', 'PJ-200', 'SN-2024-005', 'Active', cat_handling_id, 3500.00, '2024-02-28', '2027-02-28', false),
    ('EQ-006', 'Assembly Robot', 'Manufacturing', 'Building A - Floor 3', 'RoboTech', 'AR-300', 'SN-2024-006', 'Active', cat_heavy_id, 120000.00, '2023-08-15', '2026-08-15', false)
  ON CONFLICT (equipment_id) DO NOTHING;
  
  RAISE NOTICE 'Equipment inserted successfully';
END $$;

-- Step 3: Insert Maintenance Teams
INSERT INTO maintenance_teams (name, department, description, is_active) VALUES
  ('Team Alpha', 'Manufacturing', 'Primary manufacturing maintenance crew with expertise in CNC and heavy machinery', true),
  ('Team Beta', 'Warehouse', 'Warehouse equipment specialists focusing on material handling', true),
  ('Team Gamma', 'Logistics', 'Distribution and logistics maintenance for conveyor systems', true),
  ('Team Delta', 'Manufacturing', 'Advanced machinery specialists for robotics and automation', true)
ON CONFLICT DO NOTHING;

-- Step 4: Insert Sample User Profiles (for testing)
-- Note: In production, these will be created automatically when users sign up
INSERT INTO profiles (id, full_name, email, role, department, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'John Smith', 'john.smith@gearguard.com', 'technician', 'Manufacturing', '/technician-female.jpg'),
  ('00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'sarah.johnson@gearguard.com', 'technician', 'Warehouse', '/engineer-male.jpg'),
  ('00000000-0000-0000-0000-000000000003', 'Mike Davis', 'mike.davis@gearguard.com', 'technician', 'Logistics', '/technician-woman.jpg'),
  ('00000000-0000-0000-0000-000000000004', 'Emily Chen', 'emily.chen@gearguard.com', 'manager', 'Manufacturing', '/hardworking-construction-worker.png')
ON CONFLICT (id) DO NOTHING;

-- Step 5: Insert Maintenance Requests
DO $$
DECLARE
  eq1_id UUID;
  eq2_id UUID;
  eq3_id UUID;
  eq4_id UUID;
  eq5_id UUID;
  eq6_id UUID;
  user1_id UUID := '00000000-0000-0000-0000-000000000001';
  user2_id UUID := '00000000-0000-0000-0000-000000000002';
  user3_id UUID := '00000000-0000-0000-0000-000000000003';
  user4_id UUID := '00000000-0000-0000-0000-000000000004';
BEGIN
  -- Get equipment IDs
  SELECT id INTO eq1_id FROM equipments WHERE equipment_id = 'EQ-001' LIMIT 1;
  SELECT id INTO eq2_id FROM equipments WHERE equipment_id = 'EQ-002' LIMIT 1;
  SELECT id INTO eq3_id FROM equipments WHERE equipment_id = 'EQ-003' LIMIT 1;
  SELECT id INTO eq4_id FROM equipments WHERE equipment_id = 'EQ-004' LIMIT 1;
  SELECT id INTO eq5_id FROM equipments WHERE equipment_id = 'EQ-005' LIMIT 1;
  SELECT id INTO eq6_id FROM equipments WHERE equipment_id = 'EQ-006' LIMIT 1;

  -- Insert maintenance requests with proper column names
  INSERT INTO maintenance_requests (equipment_id, description, request_type, status, scheduled_date, assigned_to, created_by, priority, notes) VALUES
  -- New Requests
  (eq1_id, 'Replace hydraulic fluid - Scheduled hydraulic fluid replacement for optimal performance', 'Preventive', 'new', '2025-01-15', user1_id, user1_id, 'medium', 'Routine maintenance'),
  (eq2_id, 'Pressure valve inspection - Inspect and test pressure valve functionality', 'Corrective', 'new', '2025-01-10', user3_id, user1_id, 'high', 'Safety check required'),
  (eq4_id, 'Motor bearing check - Check motor bearings for wear and tear', 'Preventive', 'new', '2025-01-22', user2_id, user1_id, 'medium', 'Preventive inspection'),
  (eq5_id, 'Lubrication service - Apply lubrication to all moving parts', 'Preventive', 'new', '2025-01-05', user3_id, user1_id, 'low', 'Routine service'),
  
  -- In Progress Requests
  (eq1_id, 'Calibration required - Annual calibration and precision adjustment', 'Preventive', 'in-progress', '2025-01-18', user2_id, user1_id, 'high', 'Annual maintenance'),
  (eq4_id, 'Belt replacement needed - Replace worn conveyor belt', 'Corrective', 'in-progress', '2025-01-20', user4_id, user1_id, 'high', 'Urgent repair'),
  (eq6_id, 'Software update - Update robot control software to latest version', 'Preventive', 'in-progress', '2025-01-12', user1_id, user1_id, 'medium', 'System upgrade'),
  
  -- Repaired Requests
  (eq3_id, 'Battery replacement - Replace forklift battery with new unit', 'Preventive', 'repaired', '2024-12-12', user1_id, user1_id, 'medium', 'Completed successfully'),
  (eq4_id, 'Chain tension adjustment - Adjust chain tension to specifications', 'Corrective', 'repaired', '2024-12-05', user1_id, user1_id, 'medium', 'Completed and tested'),
  (eq2_id, 'Safety inspection - Comprehensive safety system inspection', 'Preventive', 'repaired', '2024-12-18', user4_id, user1_id, 'high', 'All safety checks passed'),
  
  -- Scrap Request
  (eq5_id, 'Equipment decommission - Unit beyond economical repair', 'Emergency', 'scrap', '2024-11-20', user3_id, user1_id, 'critical', 'Approved for scrap')
  
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Maintenance requests inserted successfully';
END $$;

-- Verification Query
SELECT 
  e.equipment_id,
  e.name as equipment_name,
  e.department,
  COUNT(mr.id) as total_requests,
  SUM(CASE WHEN mr.status = 'new' THEN 1 ELSE 0 END) as new_requests,
  SUM(CASE WHEN mr.status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN mr.status = 'repaired' THEN 1 ELSE 0 END) as repaired,
  SUM(CASE WHEN mr.status = 'scrap' THEN 1 ELSE 0 END) as scrapped
FROM equipments e
LEFT JOIN maintenance_requests mr ON e.id = mr.equipment_id
GROUP BY e.id, e.equipment_id, e.name, e.department
ORDER BY e.equipment_id;

SELECT '✅ Sample data inserted successfully!' as status;
