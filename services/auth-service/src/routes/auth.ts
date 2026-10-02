import { initServer } from "@ts-rest/express";
import { authContract } from "../contracts/auth.js";
import * as authController from "../controllers/auth.controller.js";
import { callController } from "../utils/ts-rest-adapter.js";

const s = initServer();

export const authRoutes = s.router(authContract, {
    patientRegister: {
        handler: async (r) => callController(authController.registerPatient)(r),
    }
});