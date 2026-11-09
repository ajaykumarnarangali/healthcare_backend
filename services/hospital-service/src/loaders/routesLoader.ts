import type { Express } from "express";
import { hospitalContract } from "../contracts/hospital/hospital.js";
import { hospitalRoutes } from "../routes/hospital.js";
import { createExpressEndpoints } from "@ts-rest/express";
import { requestValidationErrorHandler } from "../error/errorHandler.js";

export function routerLoader(app: Express) {
    createExpressEndpoints(
        hospitalContract,
        hospitalRoutes,
        app,
        {
            requestValidationErrorHandler
        }
    );
}