-- Seed data for GearGuard application

-- Insert equipment categories
INSERT INTO equipment_categories (id, name, description, icon) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'CNC Machines', 'Computer Numerical Control machines for precision manufacturing', '⚙️'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Conveyors', 'Material handling and transportation systems', '🔄'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Forklifts', 'Material handling vehicles for warehouse operations', '🏗️'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Presses', 'Hydraulic and mechanical pressing equipment', '🔨'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Packaging Machines', 'Automated packaging and labeling equipment', '📦')
ON CONFLICT (id) DO NOTHING;

-- Insert sample equipments
INSERT INTO equipments (id, name, category_id, department, location, status, purchase_date, warranty_expiry, cost, serial_number, manufacturer, model) VALUES
  ('CNC-001', 'CNC Mill Alpha', '550e8400-e29b-41d4-a716-446655440001', 'Manufacturing', 'Building A - Floor 2', 'operational', '2022-01-15', '2025-01-15', 125000.00, 'CNC-2022-001', 'Haas Automation', 'VF-2SS'),
  ('CNC-002', 'CNC Lathe Beta', '550e8400-e29b-41d4-a716-446655440001', 'Manufacturing', 'Building A - Floor 2', 'operational', '2021-06-20', '2024-06-20', 95000.00, 'CNC-2021-045', 'Haas Automation', 'ST-20'),
  ('CONV-001', 'Belt Conveyor Line 1', '550e8400-e29b-41d4-a716-446655440002', 'Warehouse', 'Building B - Shipping', 'maintenance', '2020-03-10', '2023-03-10', 35000.00, 'CONV-2020-112', 'Hytrol', 'TA-500'),
  ('FORK-001', 'Forklift Unit 5', '550e8400-e29b-41d4-a716-446655440003', 'Logistics', 'Warehouse Yard', 'operational', '2023-02-01', '2026-02-01', 45000.00, 'FORK-2023-008', 'Toyota', 'Model 8FGU25'),
  ('FORK-002', 'Forklift Unit 7', '550e8400-e29b-41d4-a716-446655440003', 'Logistics', 'Warehouse Yard', 'operational', '2023-03-15', '2026-03-15', 45000.00, 'FORK-2023-012', 'Toyota', 'Model 8FGU25'),
  ('PRESS-001', 'Hydraulic Press 200T', '550e8400-e29b-41d4-a716-446655440004', 'Manufacturing', 'Building A - Floor 1', 'operational', '2019-08-22', '2022-08-22', 180000.00, 'PRESS-2019-034', 'Schuler', 'HPM-200'),
  ('PACK-001', 'Automated Packer X1', '550e8400-e29b-41d4-a716-446655440005', 'Warehouse', 'Building B - Packing', 'operational', '2022-11-05', '2025-11-05', 65000.00, 'PACK-2022-089', 'Bosch', 'APX-1000')
ON CONFLICT (id) DO NOTHING;

-- Note: We don't seed profiles here as they will be created through Supabase Auth
-- The profile will be automatically created when users sign up

-- Insert sample maintenance teams
INSERT INTO maintenance_teams (id, name, description, department, is_active) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Manufacturing Maintenance', 'Handles all manufacturing equipment maintenance', 'Manufacturing', true),
  ('650e8400-e29b-41d4-a716-446655440002', 'Warehouse Operations', 'Responsible for warehouse equipment and conveyors', 'Warehouse', true),
  ('650e8400-e29b-41d4-a716-446655440003', 'Logistics Support', 'Maintains forklifts and logistics vehicles', 'Logistics', true)
ON CONFLICT (id) DO NOTHING;

-- Sample maintenance requests will be created through the UI
-- But here's a template for reference:
-- INSERT INTO maintenance_requests (equipment_id, title, description, request_type, priority, status, scheduled_date, due_date) VALUES
--   ('CNC-001', 'Routine inspection', 'Monthly preventive maintenance check', 'preventive', 'medium', 'new', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '14 days');
