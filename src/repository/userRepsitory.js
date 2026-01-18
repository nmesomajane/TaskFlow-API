
import pool from '../database/connection.js';

// Repository handles all database queries for users
class UserRepository {
  
  async findByEmail(email) {
  
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    return result.rows[0] || null;
  }

  // Find a user by their ID
  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Create a new user in the database
  async create(userData) {
    const { email, passwordHash, firstName, lastName } = userData;
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, created_at
    `;
    
    // Execute query with parameters
    const result = await pool.query(query, [
      email,
      passwordHash,
      firstName,
      lastName
    ]);
    
    // Return the created user
    return result.rows[0];
  }
}

export default new UserRepository();