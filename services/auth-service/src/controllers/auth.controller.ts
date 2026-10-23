import { APIError } from "../error/APIError.js";
import type { Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes.js";
import * as authService from "../services/auth.service.js";
import type {
    PatientRegisterRequest,
    DoctorRegisterRequest,
    VerifyEmailRequest,
    UserLoginRequest,
    RefreshRequest,
    getMeRequest
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
        await authService.verifyLicenseNumber(email, licenseNumber);
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
    const { password } = req.body;

    await authService.verifyEmail(userId, token, password);

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
    const { accessToken, refreshToken, user_info, userId, permissions } = await authService.login(email, password);

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
            message: "Logged in successfully",
            data: {
                userId,
                accessToken,
                user: user_info,
                permissions,
            }
        }
    }
}

export async function refresh(req: RefreshRequest) {

    const allowedOrigin = process.env.FRONT_END_URL;

    if (req.raw.headers.origin !== allowedOrigin) {
        throw new APIError(
            STATUS_CODES.FORBIDDEN,
            "Request could not be verified."
        );
    }

    const body = req.body;
    if (body && Object.keys(body).length > 0) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "This endpoint does not accept a request body."
        );
    }

    const refreshToken = req.raw.cookies?.refreshToken;
    if (!refreshToken) {
        throw new APIError(
            STATUS_CODES.UNAUTHORIZED,
            "Session expired or invalid. Please log in again."
        );
    }

    const { accessToken } = await authService.refresh(refreshToken);

    return {
        status: STATUS_CODES.OK,
        body: {
            success: true,
            message: "token generated successfully",
            data: { accessToken }
        }
    }
}

export async function getMe(req: getMeRequest) {

    const { userId } = req.user!;
    const { user_info, permissions } = await authService.getMe(userId);
    return {
        status: STATUS_CODES.OK,
        body: {
            success: true,
            message: "Logged in successfully",
            data: {
                user: user_info,
                permissions,
            }
        }
    }
}