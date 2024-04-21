// src/middleware/error.middleware.js

/**
 * Error handling middleware.
 * This middleware should be used last, after all other middleware and routes.
 * 
 * @param {Object} err - The error object that may contain message, status, and stack properties.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const handleError = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    // Log the error including the stack when not in production
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    // Send the error response
    res.status(status).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }) // include stack trace in non-production environments
    });
};

module.exports = handleError;
