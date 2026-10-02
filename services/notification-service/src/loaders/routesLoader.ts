import type { Express } from "express";
import { createExpressEndpoints } from "@ts-rest/express";
import { requestValidationErrorHandler } from "../error/errorHandler.js";

export function routerLoader(app: Express) {
    // createExpressEndpoints(
    //     authContract,
    //     authRoutes,
    //     app,
    //     {
    //         requestValidationErrorHandler
    //     }
    // );
}