import { APIError } from "../error/APIError.js";
import type { Response } from "express";
import { STATUS_CODES, USER_STATUS, USER_ROLES } from "../constants/index.js";
import * as hospitalService from "../services/hospital.service.js";
import * as userService from "../services/user.grpc.service.js";
import type {
    HospitalCreationReq
} from "../contracts/hospital/types.js";

export async function createHospital(req: HospitalCreationReq) {

    const hospitalData = req.body;
    const hospitalImage = req.file;
    const userId = req.user!.userId;

    const user = await userService.getUser(userId);

    if (!user || user.status !== USER_STATUS.ACTIVE) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            'User not found or inactive'
        );
    }

    if (user.role !== USER_ROLES.GLOBAL_ADMIN) {
        throw new APIError(
            STATUS_CODES.FORBIDDEN,
            'Only global administrators can perform this action'
        );
    }

    await hospitalService.createHospital(hospitalData, hospitalImage);

    return {
        status: STATUS_CODES.CREATED,
        body: {
            success: true,
            message: "Hospital created successfully"
        }
    };
}