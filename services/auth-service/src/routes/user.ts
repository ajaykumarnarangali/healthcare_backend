import { initServer } from "@ts-rest/express";
import { userContract } from "../contracts/user/user.js";
import * as userController from "../controllers/user.controller.js";
import type { Response } from "express";
import {
    callController,
    callControllerWithResponse
} from "../utils/ts-rest-adapter.js";
import {
    authorize,
    rateLimiter,
    authenticate,
    rateLimitConfig,
    uploadSingleFile
} from "../middlewares/index.js";

const s = initServer();

export const userRoutes = s.router(userContract, {
    createPatientProfile: {
        middleware: [
            authenticate,
            // rateLimiter(rateLimitConfig.createProfile),
            uploadSingleFile("profilePhoto")
        ],
        handler: async (r) => callController(userController.createProfile)(r),
    },
});