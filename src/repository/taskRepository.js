
import pool from '../database/connection.js';


class TaskRepository {
  
  async create(taskData) {
    
    const { 
      projectId, 
      userId, 
      title, 
      description, 
      priority, 
      status, 
      dueDate 
    } = taskData;
    
    // SQL query to insert new task
    const query = `
      INSERT INTO tasks 
        (project_id, user_id, title, description, priority, status, due_date)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id, project_id, user_id, title, description, 
        priority, status, due_date, completed_at, 
        created_at, updated_at
    `;
    
    // Execute query
   
    const result = await pool.query(query, [
      projectId,
      userId,
      title,
      description,
      priority,
      status,
      dueDate
    ]);
    

    return result.rows[0];
  }
  
  async findById(id) {
    const query = `
      SELECT 
        t.id, 
        t.project_id, 
        t.user_id, 
        t.title, 
        t.description,
        t.priority, 
        t.status, 
        t.due_date, 
        t.completed_at,
        t.created_at, 
        t.updated_at,
        p.name as project_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

 
  
  async findAll(filters = {}) {
    // Get all tasks with optional filters
    let query = `
      SELECT 
        t.id, 
        t.project_id, 
        t.user_id, 
        t.title, 
        t.description,
        t.priority, 
        t.status, 
        t.due_date, 
        t.completed_at,
        t.created_at, 
        t.updated_at,
        p.name as project_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE 1=1
    `;
    
    
    const params = [];
    let paramCount = 1;

    // FILTER 1: By User 
    if (filters.userId) {
      query += ` AND t.user_id = $${paramCount}`;
      params.push(filters.userId);
      paramCount++;
    }

    // FILTER 2: By Project 
    if (filters.projectId) {
      query += ` AND t.project_id = $${paramCount}`;
      params.push(filters.projectId);
      paramCount++;
    }


    // FILTER 3: By Status 
    if (filters.status) {
      query += ` AND t.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    // FILTER 4: By Priority 
    if (filters.priority) {
      query += ` AND t.priority = $${paramCount}`;
      params.push(filters.priority);
      paramCount++;
    }

    // FILTER 5: Due Before
    if (filters.dueBefore) {
      query += ` AND t.due_date <= $${paramCount}`;
      params.push(filters.dueBefore);
      paramCount++;
    }
    query += ` 
      ORDER BY 
        CASE 
          WHEN t.due_date IS NOT NULL THEN 0 
          ELSE 1 
        END,
        t.due_date ASC,
        CASE t.priority
          WHEN 'high' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 3
        END,
        t.created_at DESC
    `;


    const result = await pool.query(query, params);
    return result.rows;
  }

  
  async findByProjectId(projectId, userId) {
    
    const query = `
      SELECT 
        t.id, 
        t.project_id, 
        t.user_id, 
        t.title, 
        t.description,
        t.priority, 
        t.status, 
        t.due_date, 
        t.completed_at,
        t.created_at, 
        t.updated_at
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.project_id = $1 AND p.user_id = $2
      ORDER BY 
        t.due_date ASC NULLS LAST,
        t.created_at DESC
    `;
   
    
    const result = await pool.query(query, [projectId, userId]);
    return result.rows;
  }

  
  async update(id, updates) {
 
    
    const fields = [];
    const values = [];
    let paramCount = 1;
        // Build dynamic update query
    
    if (updates.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(updates.title);
      paramCount++;
    }

    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(updates.description);
      paramCount++;
    }

    if (updates.priority !== undefined) {
      fields.push(`priority = $${paramCount}`);
      values.push(updates.priority);
      paramCount++;
    }

    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount}`);
      values.push(updates.status);
      paramCount++;
    }

    if (updates.dueDate !== undefined) {
      fields.push(`due_date = $${paramCount}`);
      values.push(updates.dueDate);
      paramCount++;
    }
    if (updates.completedAt !== undefined) {
      fields.push(`completed_at = $${paramCount}`);
      values.push(updates.completedAt);
      paramCount++;
    }
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    
    
    values.push(id);

    
    const query = `
      UPDATE tasks
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING 
        id, project_id, user_id, title, description,
        priority, status, due_date, completed_at,
        created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }


  
  async delete(id) {
    const query = 'DELETE FROM tasks WHERE id = $1';
    await pool.query(query, [id]);
  }


  
  async canUserAccessTask(taskId, userId) {
   // Check if the task belongs to a project owned by the user
    
    const query = `
      SELECT t.id 
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1 AND p.user_id = $2
    `;
    
    const result = await pool.query(query, [taskId, userId]);
    return result.rows.length > 0;
  }


  
  async getTaskStats(userId) {
    // Get count of tasks in each status
    
    const query = `
      SELECT 
        t.status,
        COUNT(*) as count
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.user_id = $1
      GROUP BY t.status
    `;
    
    const result = await pool.query(query, [userId]);
    
  
    
    const stats = {
      todo: 0,
      'in-progress': 0,
      done: 0
    };
    
    result.rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
    });
    
    return stats;
  }

  
  async getOverdueTasks(userId) {
   
    
    const query = `
      SELECT 
        t.*,
        p.name as project_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.user_id = $1
        AND t.status != 'done'
        AND t.due_date < NOW()
      ORDER BY t.due_date ASC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}


export default new TaskRepository();