import pool from '../database/connection.js';

class ProjectRepository {
  
  // Create new project
  async create(projectData) {
    const { userId, name, description, status } = projectData;
    
    const query = `
      INSERT INTO projects (user_id, name, description, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, name, description, status, created_at, updated_at
    `;
    
    const result = await pool.query(query, [userId, name, description, status]);
    return result.rows[0];
  }

  // Find project by ID
  async findById(id) {
    const query = `
      SELECT id, user_id, name, description, status, created_at, updated_at
      FROM projects
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find all projects for a user
  async findByUserId(userId, filters = {}) {
    let query = `
      SELECT id, user_id, name, description, status, created_at, updated_at
      FROM projects
      WHERE user_id = $1
    `;
    
    const params = [userId];
    let paramCount = 2;

    // Apply filters
    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Update project
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(updates.name);
      paramCount++;
    }

    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(updates.description);
      paramCount++;
    }

    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount}`);
      values.push(updates.status);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE projects
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, user_id, name, description, status, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete project
  async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Check if user owns project
  async isOwner(projectId, userId) {
    const query = 'SELECT id FROM projects WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [projectId, userId]);
    return result.rows.length > 0;
  }
}

export default new ProjectRepository();