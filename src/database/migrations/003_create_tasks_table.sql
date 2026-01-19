-- Create enum types for tasks
DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
  CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'done');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'todo',
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Create trigger for updated_at
CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to set completed_at when status changes to 'done'
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'done' AND OLD.status != 'done' THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status != 'done' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_task_completed_at 
  BEFORE UPDATE OF status ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_completed_at();