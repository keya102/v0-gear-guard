-- Add missing columns to equipments table
ALTER TABLE equipments 
ADD COLUMN IF NOT EXISTS cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS serial_number TEXT;

-- Update existing rows to have sequential equipment_id values
DO $$
DECLARE
  rec RECORD;
  counter INTEGER := 1;
BEGIN
  FOR rec IN 
    SELECT id FROM equipments ORDER BY created_at
  LOOP
    UPDATE equipments 
    SET equipment_id = 'EQ-' || LPAD(counter::TEXT, 3, '0')
    WHERE id = rec.id;
    counter := counter + 1;
  END LOOP;
END $$;

-- Create index on serial_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_equipments_serial_number ON equipments(serial_number);
CREATE INDEX IF NOT EXISTS idx_equipments_manufacturer ON equipments(manufacturer);
