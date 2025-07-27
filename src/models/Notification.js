import { v4 as uuidv4 } from 'uuid';
import dbConfig from '../config/database.js';

class Notification {
  constructor() {
    this.db = dbConfig.getConnection();
  }

  create(notificationData) {
    const notificationId = uuidv4();
    const { user_id, type, title, message } = notificationData;
    
    this.db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(notificationId, user_id, type, title, message);

    return notificationId;
  }

  findByUserId(userId) {
    return this.db.prepare(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(userId);
  }

  markAsRead(id, userId) {
    return this.db.prepare(`
      UPDATE notifications 
      SET read = TRUE 
      WHERE id = ? AND user_id = ?
    `).run(id, userId);
  }

  delete(id) {
    return this.db.prepare('DELETE FROM notifications WHERE id = ?').run(id);
  }
}

export default new Notification(); 