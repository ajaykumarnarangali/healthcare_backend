import { initServer } from "@ts-rest/express";
import { hospitalContract } from "../contracts/hospital/hospital.js";
import * as hospitalController from "../controllers/hosptial.controller.js";
import type { Response } from "express";
import {
    callController
} from "../utils/ts-rest-adapter.js";
import {
    authorize,
    rateLimiter,
    authenticate,
    rateLimitConfig,
    uploadSingleFile
} from "../middlewares/index.js";

const s = initServer();

export const hospitalRoutes = s.router(hospitalContract, {
    createHospital: {
        middleware: [
            authenticate,
            authorize("GLOBAL_ADMIN"),
            rateLimiter(rateLimitConfig.createHospital),
            uploadSingleFile("hospitalImage")
        ],
        handler: async (r) => callController(hospitalController.createHospital)(r),
    },
    updateHospital: {
        middleware: [
            authenticate,
            authorize("GLOBAL_ADMIN"),
            // rateLimiter(rateLimitConfig.updateHospital),
            uploadSingleFile("hospitalImage")
        ],
        handler: async (r) => callController(hospitalController.updateHospital)(r)
    }
});