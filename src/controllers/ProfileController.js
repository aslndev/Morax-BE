import Profile from '../models/Profile.js';
import User from '../models/User.js';

class ProfileController {
  getProfile(req, res) {
    try {
      const user = User.findById(req.user.userId);
      const profile = Profile.findById(req.user.userId);
      
      if (!user || !profile) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user, profile });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  updateProfile(req, res) {
    try {
      const updates = req.body;
      const fields = Object.keys(updates).filter(key => key !== 'id');
      
      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const updatedProfile = Profile.update(req.user.userId, updates);
      if (!updatedProfile) {
        return res.status(400).json({ error: 'Failed to update profile' });
      }

      res.json(updatedProfile);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new ProfileController(); 