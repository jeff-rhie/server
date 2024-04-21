// src/app.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger.config');
const userRoutes = require('./api/users/users.routes');
const memoRoutes = require('./api/memos/memos.routes');
const handleError = require('./middleware/error.middleware');


const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to match your client URL
  credentials: true
}));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Setup routes with their base paths
app.use('/users', userRoutes);
app.use('/memos', memoRoutes);

app.use(handleError);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send({ error: 'Not Found' });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).send({ error: message });
});

module.exports = app;
