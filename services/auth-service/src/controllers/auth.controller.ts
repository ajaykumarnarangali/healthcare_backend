import { APIError } from "../error/APIError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import type { PatientRegisterRequest } from "../contracts/types.js";
import * as authService from "../services/auth.service.js";

export async function registerPatient(req: PatientRegisterRequest) {
    const { email, password } = req.body;

    await authService.registerPatient(email, password);

    return {
        status: STATUS_CODES.CREATED,
        body: {
            success: true,
            message: "Patient registered successfully",
        },
    };
}