// src/config/swagger.config.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Memo API',
      version: '1.0.0',
      description: 'A simple API to manage memos',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
    components: {
      schemas: {
        Memo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'Identifier of the Memo'
            },
            content: {
              type: 'string',
              example: 'Remember to buy milk',
              description: 'Content of the memo'
            },
            userId: {
              type: 'integer',
              example: 1,
              description: 'User ID to which the memo belongs'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2021-07-21T17:32:28Z',
              description: 'The date and time the memo was created'
            }
          }
        },
        MemoInput: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              example: 'Remember to buy milk',
              description: 'Content for the new memo'
            }
          }
        }
      }
    }
  },
  apis: ['./src/api/**/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
