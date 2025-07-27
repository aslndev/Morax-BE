import dbConfig from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const initializeDatabase = () => {
  const db = dbConfig.getConnection();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student', 'guest')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      thumbnail_url TEXT,
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
      category TEXT NOT NULL,
      author_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      approved_at TEXT,
      approved_by TEXT,
      FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (approved_by) REFERENCES profiles(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS course_materials (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('pdf', 'ppt', 'docx', 'youtube', 'image', 'audio')),
      file_url TEXT,
      youtube_url TEXT,
      youtube_embed_id TEXT,
      audio_url TEXT,
      file_size INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      parent_id TEXT,
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      dislikes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS comment_reactions (
      id TEXT PRIMARY KEY,
      comment_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
      UNIQUE(comment_id, user_id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
    )
  `);

  const adminExists = db.prepare('SELECT COUNT(*) as count FROM profiles WHERE role = ?').get('admin');
  if (adminExists.count === 0) {
    const adminId = uuidv4();
    const passwordHash = bcrypt.hashSync('admin123', 10);
    
    db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').run(adminId, 'admin@morax.com', passwordHash);
    db.prepare('INSERT INTO profiles (id, email, full_name, role) VALUES (?, ?, ?, ?)').run(adminId, 'admin@morax.com', 'Administrator', 'admin');
  }

  const courseExists = db.prepare('SELECT COUNT(*) as count FROM courses').get();
  if (courseExists.count === 0) {
    const adminProfile = db.prepare('SELECT * FROM profiles WHERE role = ?').get('admin');
    if (adminProfile) {
      const courses = [
        {
          id: uuidv4(),
          title: 'Introduction to Web Development',
          description: 'Learn the basics of HTML, CSS, and JavaScript',
          content: 'This comprehensive course covers the fundamentals of web development including HTML structure, CSS styling, and JavaScript programming. You will learn how to create responsive websites and understand the core concepts of modern web development.',
          category: 'Programming',
          status: 'approved',
          author_id: adminProfile.id,
          approved_by: adminProfile.id,
          approved_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: 'React.js Fundamentals',
          description: 'Master the popular React.js library',
          content: 'Dive deep into React.js and learn how to build modern web applications. This course covers components, state management, hooks, and advanced React patterns.',
          category: 'Programming',
          status: 'approved',
          author_id: adminProfile.id,
          approved_by: adminProfile.id,
          approved_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: 'Database Design Principles',
          description: 'Learn how to design efficient databases',
          content: 'Understanding database design is crucial for any developer. This course teaches you normalization, relationships, indexing, and optimization techniques.',
          category: 'Database',
          status: 'approved',
          author_id: adminProfile.id,
          approved_by: adminProfile.id,
          approved_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: 'Advanced JavaScript Concepts',
          description: 'Deep dive into JavaScript advanced features',
          content: 'Explore closures, prototypes, async/await, and modern JavaScript patterns. This course is designed for experienced developers.',
          category: 'Programming',
          status: 'pending',
          author_id: adminProfile.id,
          approved_by: null,
          approved_at: null
        },
        {
          id: uuidv4(),
          title: 'Machine Learning Basics',
          description: 'Introduction to machine learning algorithms',
          content: 'Learn the fundamentals of machine learning including supervised and unsupervised learning, neural networks, and data preprocessing.',
          category: 'Data Science',
          status: 'pending',
          author_id: adminProfile.id,
          approved_by: null,
          approved_at: null
        },
        {
          id: uuidv4(),
          title: 'Mobile App Development',
          description: 'Build mobile applications with React Native',
          content: 'Learn to create cross-platform mobile applications using React Native. This course covers navigation, state management, and native modules.',
          category: 'Mobile Development',
          status: 'rejected',
          author_id: adminProfile.id,
          approved_by: null,
          approved_at: null
        }
      ];

      const insertCourse = db.prepare(`
        INSERT INTO courses (id, title, description, content, category, status, author_id, approved_by, approved_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      courses.forEach(course => {
        insertCourse.run(
          course.id,
          course.title,
          course.description,
          course.content,
          course.category,
          course.status,
          course.author_id,
          course.approved_by,
          course.approved_at
        );
      });
    }
  }

  console.log('Database initialized successfully');
};

export default initializeDatabase; 