import { v4 as uuidv4 } from 'uuid';
import dbConfig from '../config/database.js';

class CourseMaterial {
  constructor() {
    this.db = dbConfig.getConnection();
  }

  create(materialData) {
    const materialId = uuidv4();
    const { course_id, title, type, file_url, youtube_url, youtube_embed_id, audio_url, file_size } = materialData;
    
    this.db.prepare(`
      INSERT INTO course_materials (id, course_id, title, type, file_url, youtube_url, youtube_embed_id, audio_url, file_size)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(materialId, course_id, title, type, file_url || null, youtube_url || null, youtube_embed_id || null, audio_url || null, file_size || null);

    return materialId;
  }

  findByCourseId(courseId) {
    return this.db.prepare(`
      SELECT * FROM course_materials 
      WHERE course_id = ? 
      ORDER BY created_at ASC
    `).all(courseId);
  }

  findById(id, courseId) {
    return this.db.prepare('SELECT * FROM course_materials WHERE id = ? AND course_id = ?').get(id, courseId);
  }

  update(id, updates) {
    const fields = Object.keys(updates).filter(key => key !== 'id');
    if (fields.length === 0) {
      return false;
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    
    this.db.prepare(`UPDATE course_materials SET ${setClause}, updated_at = ? WHERE id = ?`).run(
      ...values, 
      new Date().toISOString(), 
      id
    );
    
    return this.findById(id);
  }

  delete(id) {
    return this.db.prepare('DELETE FROM course_materials WHERE id = ?').run(id);
  }
}

export default new CourseMaterial(); 