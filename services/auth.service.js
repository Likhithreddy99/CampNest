const { User } = require('../models');
const bcrypt = require('bcryptjs');

class AuthService {
  async registerUser(userData) {
    const { username, email, password } = userData;

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
  }

  async findUserById(id) {
    return await User.findByPk(id);
  }
}

module.exports = new AuthService();
