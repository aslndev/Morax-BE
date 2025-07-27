import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dbConfig from '../config/database.js';

class User {
  constructor() {
    this.db = dbConfig.getConnection();
  }

  async create(email, password, fullName, role = 'student') {
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    
    const transaction = this.db.transaction(() => {
      this.db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').run(userId, email, passwordHash);
      this.db.prepare('INSERT INTO profiles (id, email, full_name, role) VALUES (?, ?, ?, ?)').run(userId, email, fullName, role);
    });
    
    transaction();
    return userId;
  }

  findByEmail(email) {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  getAll() {
    return this.db.prepare('SELECT * FROM users').all();
  }

  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  async updatePassword(userId, newPassword) {
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    this.db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
      newPasswordHash, 
      new Date().toISOString(), 
      userId
    );
  }

  delete(userId) {
    return this.db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  }
}

export default new User(); 