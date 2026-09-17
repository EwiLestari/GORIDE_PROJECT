export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  
  // Custom structure for Zod validation errors (422) or other specific errors
  if (err.name === 'ZodError') {
    return res.status(422).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.errors
    });
  }

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
