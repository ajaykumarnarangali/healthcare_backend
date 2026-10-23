import type { Express } from "express";
import { authContract } from "../contracts/user/auth.js";
import { authRoutes } from "../routes/auth.js";
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
}