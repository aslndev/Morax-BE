import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseConfig {
  constructor() {
    this.dbPath = process.env.DB_PATH || path.join(__dirname, '../../morax.db');
    this.db = null;
  }

  connect() {
    try {
      this.db = new Database(this.dbPath);
      this.db.pragma('foreign_keys = ON');
      console.log(`Database connected: ${this.dbPath}`);
      return this.db;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  getConnection() {
    if (!this.db) {
      this.connect();
    }
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close();
      console.log('Database connection closed');
    }
  }
}

export default new DatabaseConfig(); 