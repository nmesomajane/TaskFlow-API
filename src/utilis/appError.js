
class AppError extends Error {
  constructor(message, statusCode) {
   
    super(message);
    
    // Store HTTP status code 
    this.statusCode = statusCode;
    // Determine status based on status code
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
   
    this.isOperational = true;
    
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;