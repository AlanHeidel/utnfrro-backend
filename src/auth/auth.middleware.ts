import { Request, Response, NextFunction } from "express";
import { verifyToken, AnyTokenPayload } from "./auth.utils.js";
import { AccountRole } from "../account/account.entity.js";

export function requireAuth(req: Request & { user?: AnyTokenPayload }, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "missing token" });
    try {
        req.user = verifyToken(header.slice(7));
        next();
    } catch {
        return res.status(401).json({ message: "invalid or expired token" });
    }
}

export function requireRole(...roles: AccountRole[]) {
    return (req: Request & { user?: AnyTokenPayload }, res: Response, next: NextFunction) => {
        if (!req.user || req.user.kind !== "account" || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "forbidden" });
        }
        next();
    };
}

export function requireTableDevice(req: Request & { user?: AnyTokenPayload }, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ message: "missing token" });
    try {
        const payload = verifyToken(header.slice(7));
        if (payload.kind !== "table-device") {
            return res.status(403).json({ message: "forbidden" });
        }
        req.user = payload;
        return next();
    } catch {
        return res.status(401).json({ message: "invalid or expired token" });
    }
}