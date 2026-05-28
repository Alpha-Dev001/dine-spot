import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const statusCode = (err as { statusCode?: number }).statusCode ?? 500;
    res.status(statusCode).json({
        message: err instanceof Error ? err.message : 'Internal server error'
    });
};

export default errorHandler;
