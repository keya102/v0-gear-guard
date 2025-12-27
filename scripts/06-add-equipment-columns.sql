-- Add missing columns to equipments table

ALTER TABLE equipments 
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS serial_number TEXT,
ADD COLUMN IF NOT EXISTS cost DECIMAL(12, 2);

-- Also add equipment_id if it doesn't exist (for backwards compatibility)
ALTER TABLE equipments 
ADD COLUMN IF NOT EXISTS equipment_id TEXT;

-- Make equipment_id unique if it's not already
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'equipments_equipment_id_key'
  ) THEN
    ALTER TABLE equipments ADD CONSTRAINT equipments_equipment_id_key UNIQUE (equipment_id);
  END IF;
END $$;

-- Update equipment_id for existing rows that don't have it
UPDATE equipments 
SET equipment_id = 'EQ-' || LPAD(CAST(ROW_NUMBER() OVER (ORDER BY created_at) AS TEXT), 3, '0')
WHERE equipment_id IS NULL;
