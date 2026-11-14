import { APIError } from "../error/APIError.js";
import { STATUS_CODES, type UserRole } from "../constants/index.js";
import * as hospitalService from "../services/hospital.service.js";
import type {
    HospitalCreationReq,
    HospitalGetReq,
    HospitalsGetReq,
    HospitalUpdationReq
} from "../contracts/hospital/types.js";

export async function createHospital(req: HospitalCreationReq) {

    const hospitalData = req.body;
    const hospitalImage = req.file;
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
    const { hospitalId } = req.params;

    if (!hospitalImage && Object.keys(hospitalData).length === 0) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            'At least one detail or a new image is required'
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
    const role = req.user!.role;
    const { hospitalId } = req.params;

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

export async function getHospitals(req: HospitalsGetReq) {
    const query = req.query;

    const { hospitals, pagination } = await hospitalService.getHospitals(query);

    return {
        status: STATUS_CODES.OK,
        body: {
            success: true,
            message: "Hospital fetched successfully",
            data: {
                hospitals,
                pagination
            }
        }
    };
}