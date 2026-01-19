-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_task_id ON focus_sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started_at ON focus_sessions(started_at DESC);

-- Create trigger to calculate duration when session ends
CREATE OR REPLACE FUNCTION calculate_focus_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
    NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_session_duration 
  BEFORE UPDATE OF ended_at ON focus_sessions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_focus_duration();