import dbConfig from '../config/database.js';

export const loadUserProfile = (req, res, next) => {
  try {
    const db = dbConfig.getConnection();
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.user.userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    req.userProfile = profile;
    next();
  } catch (error) {
    console.error('Profile middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 