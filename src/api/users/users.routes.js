// src/api/users/users.routes.js
const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');

// The base path '/users' will be set when these routes are used in app.js
router.post('/signup', usersController.signup);
router.post('/login', usersController.login);

module.exports = router;
