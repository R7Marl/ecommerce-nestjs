import { Request, Response, NextFunction } from "express";
export function LoggerGlobal(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
    console.log(`${req.method} ${req.url} ${res.statusCode}`);
    });
    next();
}