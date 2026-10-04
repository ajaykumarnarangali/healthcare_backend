import { APIError } from "../error/APIError.js";
import type { Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes.js";
import * as authService from "../services/auth.service.js";
import type {
    PatientRegisterRequest,
    DoctorRegisterRequest,
    VerifyEmailRequest,
    UserLoginRequest
} from "../contracts/types.js";

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

export async function verifyEmail(req: VerifyEmailRequest) {

    const { userId, token } = req.query;

    await authService.verifyEmail(userId, token);

    return {
        status: STATUS_CODES.OK,
        body: {
            success: true,
            message: "Email verified successfully",
        }
    }
}

export async function login(req: UserLoginRequest, res: Response) {

    const { email, password } = req.body;
    const { accessToken, refreshToken, role } = await authService.login(email, password);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
        status: STATUS_CODES.OK,
        body: {
            success: true,
            message: "Email verified successfully",
            role,
            accessToken
        }
    }
}

