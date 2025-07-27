import AuthService from '../services/AuthService.js';

class AuthController {
  async signup(req, res) {
    try {
      const { email, password, fullName, role = 'student' } = req.body;
      
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const result = await AuthService.signup(email, password, fullName, role);
      res.status(201).json(result);
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async signin(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await AuthService.signin(email, password);
      res.json(result);
    } catch (error) {
      console.error('Signin error:', error);
      res.status(401).json({ error: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { current_password, new_password } = req.body;
      
      if (!current_password || !new_password) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      const result = await AuthService.changePassword(req.user.userId, current_password, new_password);
      res.json(result);
    } catch (error) {
      console.error('Password update error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController(); 