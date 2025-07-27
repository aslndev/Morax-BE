import dbConfig from '../config/database.js';

class Profile {
  constructor() {
    this.db = dbConfig.getConnection();
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM profiles WHERE id = ?').get(id);
  }

  findByEmail(email) {
    return this.db.prepare('SELECT * FROM profiles WHERE email = ?').get(email);
  }

  update(id, updates) {
    const fields = Object.keys(updates).filter(key => key !== 'id');
    if (fields.length === 0) {
      return false;
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    
    this.db.prepare(`UPDATE profiles SET ${setClause}, updated_at = ? WHERE id = ?`).run(
      ...values, 
      new Date().toISOString(), 
      id
    );
    
    return this.findById(id);
  }

  updateRole(id, role) {
    this.db.prepare('UPDATE profiles SET role = ?, updated_at = ? WHERE id = ?').run(
      role, 
      new Date().toISOString(), 
      id
    );
  }

  getAll() {
    return this.db.prepare(`
      SELECT 
        u.id,
        u.email,
        u.created_at,
        u.updated_at,
        p.full_name,
        p.avatar_url,
        p.role,
        p.created_at as profile_created_at,
        p.updated_at as profile_updated_at
      FROM users u
      JOIN profiles p ON u.id = p.id
      ORDER BY u.created_at DESC
    `).all();
  }

  delete(id) {
    return this.db.prepare('DELETE FROM profiles WHERE id = ?').run(id);
  }
}

export default new Profile(); 