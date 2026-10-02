import { APIError } from "../error/APIError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import type { PatientRegisterRequest, DoctorRegisterRequest } from "../contracts/types.js";
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

export async function registerDoctor(req: DoctorRegisterRequest) {
    const { email, password, licenseNumber } = req.body;

    const licenseVerification =
        authService.verifyLicenseNumber(licenseNumber);
    if (!licenseVerification) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "Invalid license number"
        );
    }

    await authService.registerDoctor(email, password);

    return {
        status: STATUS_CODES.CREATED,
        body: {
            success: true,
            message: "Doctor registered successfully",
        },
    };
}