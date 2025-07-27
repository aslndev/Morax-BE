import { v4 as uuidv4 } from 'uuid';
import dbConfig from '../config/database.js';

class Comment {
  constructor() {
    this.db = dbConfig.getConnection();
  }

  create(commentData) {
    const commentId = uuidv4();
    const { course_id, user_id, parent_id, content } = commentData;
    
    this.db.prepare(`
      INSERT INTO comments (id, course_id, user_id, parent_id, content)
      VALUES (?, ?, ?, ?, ?)
    `).run(commentId, course_id, user_id, parent_id || null, content);

    return commentId;
  }

  findByCourseId(courseId) {
    return this.db.prepare(`
      SELECT 
        c.*,
        p.full_name,
        p.avatar_url,
        p.role
      FROM comments c
      JOIN profiles p ON c.user_id = p.id
      WHERE c.course_id = ?
      ORDER BY c.created_at DESC
    `).all(courseId);
  }

  findById(id, courseId) {
    return this.db.prepare('SELECT * FROM comments WHERE id = ? AND course_id = ?').get(id, courseId);
  }

  update(id, updates) {
    const fields = Object.keys(updates).filter(key => key !== 'id');
    if (fields.length === 0) {
      return false;
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    
    this.db.prepare(`UPDATE comments SET ${setClause}, updated_at = ? WHERE id = ?`).run(
      ...values, 
      new Date().toISOString(), 
      id
    );
    
    return this.findById(id);
  }

  delete(id) {
    return this.db.prepare('DELETE FROM comments WHERE id = ?').run(id);
  }
}

export default new Comment(); 