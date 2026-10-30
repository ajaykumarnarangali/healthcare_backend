import { initServer } from "@ts-rest/express";
import { userContract } from "../contracts/user/user.js";
import * as userController from "../controllers/user.controller.js";
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

export const userRoutes = s.router(userContract, {
    createUserProfile: {
        middleware: [
            authenticate,
            // rateLimiter(rateLimitConfig.createProfile),
            uploadSingleFile("profilePhoto")
        ],
        handler: async (r) => callController(userController.createProfile)(r),
    },
    getUserProfile: {
        middleware: [
            authenticate,
            // rateLimiter(rateLimitConfig.getProfile)
        ],
        handler: async (r) => callController(userController.getProfile)(r),
    }
});