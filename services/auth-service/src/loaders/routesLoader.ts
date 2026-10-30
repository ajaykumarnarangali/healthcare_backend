import type { Express } from "express";
import { authContract } from "../contracts/auth/auth.js";
import { userContract } from "../contracts/user/user.js";
import { authRoutes } from "../routes/auth.js";
import { userRoutes } from "../routes/user.js";
import { createExpressEndpoints } from "@ts-rest/express";
import { requestValidationErrorHandler } from "../error/errorHandler.js";

export function routerLoader(app: Express) {
    createExpressEndpoints(
        authContract,
        authRoutes,
        app,
        {
            requestValidationErrorHandler
        }
    );
    createExpressEndpoints(
        userContract,
        userRoutes,
        app,
        {
            requestValidationErrorHandler
        }
    );
}