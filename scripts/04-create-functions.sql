-- Utility functions for GearGuard application

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log maintenance request changes
CREATE OR REPLACE FUNCTION log_maintenance_request_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO maintenance_request_history (
    request_id,
    changed_by,
    action,
    old_status,
    new_status,
    old_assigned_to,
    new_assigned_to,
    changes,
    notes
  ) VALUES (
    NEW.id,
    auth.uid(),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' THEN 'updated'
      WHEN TG_OP = 'DELETE' THEN 'deleted'
    END,
    OLD.status,
    NEW.status,
    OLD.assigned_to,
    NEW.assigned_to,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ),
    CASE 
      WHEN OLD.status != NEW.status THEN 'Status changed from ' || OLD.status || ' to ' || NEW.status
      WHEN OLD.assigned_to != NEW.assigned_to THEN 'Assignment changed'
      ELSE 'Request updated'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log maintenance request changes
DROP TRIGGER IF EXISTS maintenance_request_change_log ON maintenance_requests;
CREATE TRIGGER maintenance_request_change_log
  AFTER INSERT OR UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION log_maintenance_request_change();

-- Function to mark equipment as scrapped when maintenance request moves to scrap
CREATE OR REPLACE FUNCTION handle_equipment_scrap()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'scrap' AND (OLD.status IS NULL OR OLD.status != 'scrap') THEN
    UPDATE equipments
    SET 
      is_scrapped = true,
      status = 'scrapped',
      scrapped_at = NOW(),
      scrapped_by = auth.uid(),
      notes = COALESCE(notes || E'\n\n', '') || 
              'Equipment scrapped via maintenance request ' || NEW.id::text || 
              ' on ' || NOW()::date::text
    WHERE id = NEW.equipment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle equipment scrap
DROP TRIGGER IF EXISTS equipment_scrap_trigger ON maintenance_requests;
CREATE TRIGGER equipment_scrap_trigger
  AFTER INSERT OR UPDATE OF status ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION handle_equipment_scrap();

-- Function to get maintenance request count for equipment
CREATE OR REPLACE FUNCTION get_equipment_open_requests(equipment_id_param TEXT)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM maintenance_requests
  WHERE equipment_id = equipment_id_param
    AND status NOT IN ('repaired', 'scrap');
$$ LANGUAGE sql STABLE;
