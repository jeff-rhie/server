// src/services/prisma.service.js
const { PrismaClient } = require('@prisma/client');
exports.prisma = new PrismaClient();
