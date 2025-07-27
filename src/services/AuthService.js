import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthService {
  async signup(email, password, fullName, role = 'student') {
    const validRoles = ['student', 'teacher'];
    if (role && !validRoles.includes(role)) {
      throw new Error('Invalid role');
    }

    const existingUser = User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const userId = await User.create(email, password, fullName, role);
    return { message: 'User created successfully', userId };
  }

  async signin(email, password) {
    const user = User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const profile = Profile.findById(user.id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      profile,
      token
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await User.verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    await User.updatePassword(userId, newPassword);
    return { message: 'Password updated successfully' };
  }
}

export default new AuthService(); 