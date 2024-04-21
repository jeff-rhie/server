// src/api/memos/memos.routes.js
const express = require('express');
const router = express.Router();
const memosController = require('./memos.controller');

// Here the base path '/memos' will be set when these routes are imported and used in app.js, so we only use '/:username'
router.get('/:username', memosController.getMemos);
router.post('/:username', memosController.addMemo);

module.exports = router;