import { Request, Response, NextFunction } from "express";

export const authorize = (...validRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user;

        if(!user || !validRoles.includes(user.role)){
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }

        next();
    };
};