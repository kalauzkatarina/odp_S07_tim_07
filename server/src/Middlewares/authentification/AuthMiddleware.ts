import { UserRole } from "../../Domain/enums/UserRole";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
    username: string;
    email: string;
    role: UserRole;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({ success: false, message: "Missing the token "});
        return;
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET ?? ""
        ) as JwtPayload;

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Unvalid token" });
    }
};