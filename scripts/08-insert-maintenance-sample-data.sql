-- Insert sample maintenance requests data
-- This script adds sample maintenance requests to match the UI data

-- First, let's assume you have equipment and user profiles set up
-- We'll use the equipment IDs from the previous seed data

-- Note: Replace the assigned_to and created_by UUIDs with actual user IDs from your profiles table
-- You can get user IDs by running: SELECT id, email FROM profiles;

DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
  user4_id UUID;
  eq1_id UUID;
  eq2_id UUID;
  eq3_id UUID;
  eq4_id UUID;
  eq5_id UUID;
BEGIN
  -- Get equipment IDs (assuming they exist from previous seed)
  SELECT id INTO eq1_id FROM equipments WHERE equipment_id = 'EQ-001' LIMIT 1;
  SELECT id INTO eq2_id FROM equipments WHERE equipment_id = 'EQ-002' LIMIT 1;
  SELECT id INTO eq3_id FROM equipments WHERE equipment_id = 'EQ-003' LIMIT 1;
  SELECT id INTO eq4_id FROM equipments WHERE equipment_id = 'EQ-004' LIMIT 1;
  SELECT id INTO eq5_id FROM equipments WHERE equipment_id = 'EQ-005' LIMIT 1;

  -- Get user IDs from profiles (get the first 4 users)
  SELECT id INTO user1_id FROM profiles ORDER BY created_at LIMIT 1;
  SELECT id INTO user2_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 1;
  SELECT id INTO user3_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 2;
  SELECT id INTO user4_id FROM profiles ORDER BY created_at LIMIT 1 OFFSET 3;

  -- If we don't have enough users, use the first user for all
  IF user2_id IS NULL THEN user2_id := user1_id; END IF;
  IF user3_id IS NULL THEN user3_id := user1_id; END IF;
  IF user4_id IS NULL THEN user4_id := user1_id; END IF;

  -- Insert maintenance requests
  INSERT INTO maintenance_requests (equipment_id, title, description, request_type, status, scheduled_date, due_date, assigned_to, created_by, priority) VALUES
  -- New requests
  (eq1_id, 'Replace hydraulic fluid', 'Scheduled hydraulic fluid replacement for optimal performance', 'Preventive', 'new', '2024-12-15', '2024-12-15', user1_id, user1_id, 'medium'),
  (eq2_id, 'Pressure valve inspection', 'Inspect and test pressure valve functionality', 'Corrective', 'new', '2024-12-10', '2024-12-10', user3_id, user1_id, 'high'),
  (eq4_id, 'Motor bearing check', 'Check motor bearings for wear and tear', 'Preventive', 'new', '2024-12-22', '2024-12-22', user2_id, user1_id, 'medium'),
  (eq5_id, 'Lubrication service', 'Apply lubrication to all moving parts', 'Preventive', 'new', '2025-01-05', '2025-01-05', user3_id, user1_id, 'low'),
  (eq3_id, 'Tire pressure check', 'Check and adjust tire pressure to recommended levels', 'Preventive', 'new', '2025-01-10', '2025-01-10', user2_id, user1_id, 'medium'),
  
  -- In Progress requests
  (eq1_id, 'Calibration required', 'Annual calibration and precision adjustment', 'Preventive', 'in-progress', '2024-12-18', '2024-12-18', user2_id, user1_id, 'high'),
  (eq4_id, 'Belt replacement needed', 'Replace worn conveyor belt', 'Corrective', 'in-progress', '2024-12-20', '2024-12-20', user4_id, user1_id, 'high'),
  (eq2_id, 'Safety inspection', 'Comprehensive safety system inspection', 'Preventive', 'in-progress', '2025-01-08', '2025-01-08', user4_id, user1_id, 'high'),
  (eq1_id, 'Oil leak repair', 'Identify and repair oil leak in hydraulic system', 'Corrective', 'in-progress', '2025-01-12', '2025-01-12', user3_id, user1_id, 'high'),
  
  -- Repaired requests
  (eq3_id, 'Battery replacement', 'Replace forklift battery with new unit', 'Preventive', 'repaired', '2024-12-12', '2024-12-12', user1_id, user1_id, 'medium'),
  (eq4_id, 'Chain tension adjustment', 'Adjust chain tension to specifications', 'Corrective', 'repaired', '2024-12-05', '2024-12-05', user1_id, user1_id, 'medium'),
  (eq3_id, 'Emergency brake test', 'Test and certify emergency brake system', 'Emergency', 'repaired', '2024-12-08', '2024-12-08', user4_id, user1_id, 'critical');

  RAISE NOTICE 'Successfully inserted 12 sample maintenance requests';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error inserting sample data: %', SQLERRM;
    RAISE NOTICE 'Make sure you have equipment and user profiles in your database';
END $$;

-- Verify the data was inserted
SELECT 
  mr.title,
  e.equipment_id,
  e.name as equipment_name,
  mr.status,
  mr.request_type,
  mr.due_date,
  p.full_name as assigned_to_name
FROM maintenance_requests mr
JOIN equipments e ON mr.equipment_id = e.id
LEFT JOIN profiles p ON mr.assigned_to = p.id
ORDER BY mr.created_at DESC;
