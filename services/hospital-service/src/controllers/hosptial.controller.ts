import { APIError } from "../error/APIError.js";
import { STATUS_CODES, USER_STATUS, USER_ROLES, type UserRole } from "../constants/index.js";
import * as hospitalService from "../services/hospital.service.js";
import * as userService from "../services/user.grpc.service.js";
import type {
    HospitalCreationReq,
    HospitalGetReq,
    HospitalUpdationReq
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

export async function updateHospital(req: HospitalUpdationReq) {
    const hospitalData = req.body;
    const hospitalImage = req.file;
    const userId = req.user!.userId;
    const { hospitalId } = req.params;

    if (!hospitalImage && Object.keys(hospitalData).length === 0) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            'At least one detail or a new image is required'
        );
    }

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

    await hospitalService.updateHospital(hospitalId, hospitalData, hospitalImage);

    return {
        status: STATUS_CODES.OK,
        body: {
            success: true,
            message: "Hospital updated successfully"
        }
    };
}

export async function getHospital(req: HospitalGetReq) {
    const userId = req.user!.userId;
    const role = req.user!.role;
    const { hospitalId } = req.params;

    const user = await userService.getUser(userId);

    if (!user || user.status !== USER_STATUS.ACTIVE) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            'User not found or inactive'
        );
    }

    const hospitalDetails = await hospitalService.getHospital(hospitalId, role as UserRole);

    return {
        status: STATUS_CODES.OK,
        body: {
            success: true,
            message: "Hospital fetched successfully",
            data: {
                hospitalDetails
            }
        }
    };
}