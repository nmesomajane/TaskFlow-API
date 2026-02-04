// src/repository/activityRepository.js

class ActivityRepository {
  
  // Create a new activity log
  async create(activityData) {
    const { userId, activityType, entityType, entityId, description, metadata } = activityData;
    
    const query = `
      INSERT INTO activities (user_id, activity_type, entity_type, entity_id, description, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId,
      activityType,
      entityType,
      entityId,
      description,
      JSON.stringify(metadata || {})
    ]);
    
    return result.rows[0];
  }

  // Get recent activities for a user
  async getRecentActivities(userId, limit = 20) {
    const query = `
      SELECT 
        a.*,
        u.first_name,
        u.last_name,
        u.email,
        t.title as task_title,
        p.name as project_name
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN tasks t ON a.entity_type = 'task' AND a.entity_id = t.id
      LEFT JOIN projects p ON a.entity_type = 'project' AND a.entity_id = p.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  // Get project activities (for team view)
  async getProjectActivities(projectId, limit = 50) {
    const query = `
      SELECT 
        a.*,
        u.first_name,
        u.last_name,
        u.email,
        t.title as task_title
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN tasks t ON a.entity_type = 'task' AND a.entity_id = t.id
      WHERE (a.entity_type = 'project' AND a.entity_id = $1)
         OR (a.entity_type = 'task' AND t.project_id = $1)
      ORDER BY a.created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [projectId, limit]);
    return result.rows;
  }

  // Get activities by date range
  async getActivitiesByDateRange(userId, startDate, endDate) {
    const query = `
      SELECT 
        a.*,
        u.first_name,
        u.last_name,
        t.title as task_title,
        p.name as project_name
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN tasks t ON a.entity_type = 'task' AND a.entity_id = t.id
      LEFT JOIN projects p ON a.entity_type = 'project' AND a.entity_id = p.id
      WHERE a.user_id = $1 
        AND a.created_at BETWEEN $2 AND $3
      ORDER BY a.created_at DESC
    `;
    
    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
  }
}

export default new ActivityRepository();