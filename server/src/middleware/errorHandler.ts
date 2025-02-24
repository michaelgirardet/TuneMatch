import type { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { CustomError } from '@/utils/errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erreur:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Erreur serveur interne',
  });
};
