// src/utils/bcrypt.util.js
const bcrypt = require('bcryptjs');

exports.hashPassword = (password) => bcrypt.hash(password, 10);
// Add more utility functions as needed
