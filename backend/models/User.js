const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  // Find user by email
  static async findByEmail(email) {
    const users = await db.query('users', { email });
    return users.length > 0 ? users[0] : null;
  }

  // Find user by ID
  static async findById(id) {
    return await db.getById('users', id);
  }

  // Get all users
  static async findAll() {
    return await db.get('users');
  }

  // Create new user (signup)
  static async create(userData) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'teacher',
      createdAt: new Date().toISOString()
    };

    return await db.post('users', newUser);
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user
  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await db.patch('users', id, data);
  }

  // Delete user
  static async delete(id) {
    return await db.delete('users', id);
  }
}

module.exports = UserModel;