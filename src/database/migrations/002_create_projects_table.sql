-- Create enum type for project status
DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status project_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Create trigger for updated_at
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();