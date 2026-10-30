import { initServer } from "@ts-rest/express";
import { authContract } from "../contracts/auth/auth.js";
import * as authController from "../controllers/auth.controller.js";
import type { Response } from "express";
import {
    callController,
    callControllerWithResponse
} from "../utils/ts-rest-adapter.js";
import {
    rateLimiter,
    authenticate,
    rateLimitConfig,
} from "../middlewares/index.js";

const s = initServer();

export const authRoutes = s.router(authContract, {
    patientRegister: {
        handler: async (r) => callController(authController.registerPatient)(r),
    },
    doctorRegister: {
        handler: async (r) => callController(authController.registerDoctor)(r),
    },
    verifyEmail: {
        handler: async (r) => callController(authController.verifyEmail)(r),
    },
    login: {
        middleware: [rateLimiter(rateLimitConfig.login)],
        handler: async (r) => callControllerWithResponse(authController.login)(r),
    },
    refresh: {
        // middleware: [rateLimiter(rateLimitConfig.refreshToken)],
        handler: async (r) => callController(authController.refresh)(r),
    },
    getMe: {
        middleware: [
            authenticate,
            // rateLimiter(rateLimitConfig.getMe)
        ],
        handler: async (r) => callController(authController.getMe)(r),
    },
    signOut: {
        middleware: [
            authenticate,
            rateLimiter(rateLimitConfig.signOut)
        ],
        handler: async (r) => callControllerWithResponse(authController.signout)(r),
    }
});