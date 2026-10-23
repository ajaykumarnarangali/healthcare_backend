import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { APIError } from "../../error/APIError.js";
import { STATUS_CODES, ALLOWED_ROLES, type UserRole } from "../../constants/index.js";


export function authenticate(req: Request, res: Response, next: NextFunction) {

    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return next(new APIError(
            STATUS_CODES.UNAUTHORIZED,
            "Authentication required"
        ));
    }

    const token = authorization.split(" ")[1];
    if (!token || /\s/.test(token)) {
        return next(new APIError(
            STATUS_CODES.UNAUTHORIZED,
            "Invalid access token"
        ));
    }

    try {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            return next(new APIError(
                STATUS_CODES.INTERNAL_SERVER_ERROR,
                "Internal server error"
            ));
        }

        const decoded = jwt.verify(token, secret, {
            algorithms: ["HS256"],
        });

        if (
            typeof decoded === "string" ||
            typeof decoded.sub !== "string" ||
            typeof decoded.role !== "string"
        ) {
            throw new APIError(
                STATUS_CODES.UNAUTHORIZED,
                "Invalid access token"
            );
        }

        const { sub, role } = decoded;

        if (!ALLOWED_ROLES.includes(role)) {
            return next(
                new APIError(
                    STATUS_CODES.UNAUTHORIZED,
                    "Invalid access token"
                )
            );
        }

        req.user = {
            userId: sub,
            role: role as UserRole,
        };

        return next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new APIError(
                STATUS_CODES.UNAUTHORIZED,
                "Access token has expired"
            ));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new APIError(
                STATUS_CODES.UNAUTHORIZED,
                "Invalid access token"
            ));
        }

        return next(error);
    }

}

export function authorize(...roles: UserRole[]) {

    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return next(
                new APIError(
                    STATUS_CODES.UNAUTHORIZED,
                    "Authentication required"
                )
            );
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new APIError(
                    STATUS_CODES.FORBIDDEN,
                    "You do not have permission to access this resource"
                )
            );
        }

        return next();
    }
}