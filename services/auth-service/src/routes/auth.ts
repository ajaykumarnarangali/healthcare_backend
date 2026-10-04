import { initServer } from "@ts-rest/express";
import { authContract } from "../contracts/auth.js";
import * as authController from "../controllers/auth.controller.js";
import type { Response } from "express";
import {
    callController,
    callControllerWithResponse
} from "../utils/ts-rest-adapter.js";

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
        handler: async (r) => callControllerWithResponse(authController.login)(r),
    },
});