CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'task_created', 'task_completed', 'task_updated', 'project_created', etc.
  entity_type VARCHAR(50) NOT NULL, -- 'task', 'project', 'comment'
  entity_id INTEGER NOT NULL,
  description TEXT,
  metadata JSONB, -- Store additional data like old_status, new_status, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_activities (user_id, created_at DESC),
  INDEX idx_entity (entity_type, entity_id)
);