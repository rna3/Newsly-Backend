const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // Use error.statusCode if set, otherwise default to 500.
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || 'Internal server error' });
  };
  
  export default errorHandler;
  