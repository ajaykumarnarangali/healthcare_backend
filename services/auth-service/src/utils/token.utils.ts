import crypto from "crypto";
import jwt from "jsonwebtoken";

export function generateVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
}

export function hashVerificationToken(token: string) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}

type TokenType = "access" | "refresh";
export function generateJWTToken(
    payload: object,
    type: TokenType = "access"
) {
    const secret =
        type === "access"
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET;

    const expiresIn =
        type === "access"
            ? "15m"
            : "7d";

    if (!secret) {
        throw new Error(
            `${type.toUpperCase()}_TOKEN_SECRET is not configured`
        );
    }

    return jwt.sign(payload, secret, {
        expiresIn,
    });
}