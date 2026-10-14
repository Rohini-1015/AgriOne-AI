import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('⚠️ [Error Handler]:', err);

  // Multer Error
  if (err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
      errors: [err.message],
    });
    return;
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      message: 'Validation failed on submitted fields.',
      errors: formattedErrors,
    });
    return;
  }

  // Custom Application Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [message],
  });
};
