import { v4 as uuidv4 } from 'uuid';
import dbConfig from '../config/database.js';

class Course {
  constructor() {
    this.db = dbConfig.getConnection();
  }

  create(courseData) {
    const courseId = uuidv4();
    const { title, description, content, category, thumbnail_url, author_id } = courseData;
    
    this.db.prepare(`
      INSERT INTO courses (id, title, description, content, thumbnail_url, category, author_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(courseId, title, description, content, thumbnail_url || null, category, author_id);

    return courseId;
  }

  findById(id) {
    const row = this.db.prepare(`
      SELECT 
        c.*,
        p.id as profile_id,
        p.email as profile_email,
        p.full_name as profile_full_name,
        p.avatar_url as profile_avatar_url,
        p.role as profile_role,
        p.created_at as profile_created_at,
        p.updated_at as profile_updated_at
      FROM courses c
      JOIN profiles p ON c.author_id = p.id
      WHERE c.id = ?
    `).get(id);
    
    if (!row) return null;
    
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      thumbnail_url: row.thumbnail_url,
      status: row.status,
      category: row.category,
      author_id: row.author_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      approved_at: row.approved_at,
      approved_by: row.approved_by,
      profiles: {
        id: row.profile_id,
        email: row.profile_email,
        full_name: row.profile_full_name,
        avatar_url: row.profile_avatar_url,
        role: row.profile_role,
        created_at: row.profile_created_at,
        updated_at: row.profile_updated_at,
      }
    };
  }

  findAll(status = null) {
    let query = `
      SELECT 
        c.*,
        p.id as profile_id,
        p.email as profile_email,
        p.full_name as profile_full_name,
        p.avatar_url as profile_avatar_url,
        p.role as profile_role,
        p.created_at as profile_created_at,
        p.updated_at as profile_updated_at
      FROM courses c
      JOIN profiles p ON c.author_id = p.id
    `;
    
    const params = [];
    if (status) {
      query += ' WHERE c.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const rows = this.db.prepare(query).all(...params);
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      thumbnail_url: row.thumbnail_url,
      status: row.status,
      category: row.category,
      author_id: row.author_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      approved_at: row.approved_at,
      approved_by: row.approved_by,
      profiles: {
        id: row.profile_id,
        email: row.profile_email,
        full_name: row.profile_full_name,
        avatar_url: row.profile_avatar_url,
        role: row.profile_role,
        created_at: row.profile_created_at,
        updated_at: row.profile_updated_at,
      }
    }));
  }

  update(id, updates) {
    const fields = Object.keys(updates).filter(key => key !== 'id');
    if (fields.length === 0) {
      return false;
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    
    this.db.prepare(`UPDATE courses SET ${setClause}, updated_at = ? WHERE id = ?`).run(
      ...values, 
      new Date().toISOString(), 
      id
    );
    
    return this.findById(id);
  }

  updateStatus(id, status, approvedBy = null) {
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = approvedBy;
    }
    
    const fields = Object.keys(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updateData[field]);
    
    this.db.prepare(`UPDATE courses SET ${setClause} WHERE id = ?`).run(...values, id);
  }

  delete(id) {
    return this.db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  }

  getStats() {
    return {
      total: this.db.prepare('SELECT COUNT(*) as count FROM courses').get().count,
      approved: this.db.prepare('SELECT COUNT(*) as count FROM courses WHERE status = ?').get('approved').count,
      pending: this.db.prepare('SELECT COUNT(*) as count FROM courses WHERE status = ?').get('pending').count,
      rejected: this.db.prepare('SELECT COUNT(*) as count FROM courses WHERE status = ?').get('rejected').count
    };
  }
}

export default new Course(); 