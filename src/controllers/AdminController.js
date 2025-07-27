import Profile from '../models/Profile.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

class AdminController {
  getStats(req, res) {
    try {
      const stats = {
        totalUsers: User.getAll().length,
        totalCourses: Course.getStats().total,
        approvedCourses: Course.getStats().approved,
        pendingCourses: Course.getStats().pending,
        rejectedCourses: Course.getStats().rejected
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Stats fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  getAllUsers(req, res) {
    try {
      const users = Profile.getAll();
      res.json(users);
    } catch (error) {
      console.error('Users fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      const validRoles = ['admin', 'teacher', 'student', 'guest'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      
      Profile.updateRole(id, role);
      res.json({ message: 'User role updated successfully' });
    } catch (error) {
      console.error('User role update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      if (id === req.user.userId) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }
      
      User.delete(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('User deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new AdminController(); 