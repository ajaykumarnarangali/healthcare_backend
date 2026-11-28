import { getRedisClient } from "../../loaders/init.js";
import { APIError } from "../../error/APIError.js";
import { STATUS_CODES } from "../../constants/statusCodes.js";
import type { Request, Response, NextFunction } from "express";
import type { RateLimitConfig } from "./rateLimitConfig.js";

export function rateLimiter(config: RateLimitConfig) {

    return async function (req: Request, res: Response, next: NextFunction) {

        const OptionObj: Record<string, string> = {};
        const { name, windowMs, limit, keyTypes } = config;
        const redisClient = getRedisClient();

        const ip = req.headers["x-real-ip"];
        const { user } = req;
        const { email } = req.body ?? {};
        const userId = user?.userId;

        if (keyTypes.includes("ip") && typeof ip === "string" && ip) {
            OptionObj.ip = ip;
        }

        if (keyTypes.includes("email") && typeof email === "string" && email) {
            OptionObj.email = email.trim().toLowerCase();
        }

        if (keyTypes.includes("userId") && typeof userId === "string" && userId) {
            OptionObj.userId = userId;
        }

        const missingKeys = keyTypes.filter(
            (key) => !OptionObj[key]
        );

        if (missingKeys.length > 0) {
            return next(
                new APIError(
                    STATUS_CODES.INTERNAL_SERVER_ERROR,
                    "Required rate-limit identifier is missing."
                )
            );
        }

        const redisKeys = keyTypes
            .filter((key) => OptionObj[key])
            .map((key) => `rl:${name}:${key}:${OptionObj[key]}`);

        try {

            for (const redisKey of redisKeys) {
                const count = await redisClient.incr(redisKey);

                if (count === 1) {
                    await redisClient.pExpire(redisKey, windowMs);
                }

                if (count > limit) {
                    return next(
                        new APIError(
                            STATUS_CODES.TOO_MANY_REQUESTS,
                            "Too many requests. Please try again later."
                        )
                    );
                }
            }

            return next();
        } catch (error) {
            return next(error);
        }
    }
};