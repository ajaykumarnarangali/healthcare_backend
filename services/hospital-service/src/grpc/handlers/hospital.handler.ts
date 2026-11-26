import grpc from '@grpc/grpc-js';
import { z } from "zod";
import * as HosptialRepository from "../../repositories/hospital.repository.js";

type ValidateHospitalAdminAssignmentRequest = {
    hospital_id: string;
};

type ValidateHospitalAdminAssignmentResponse = {
    exists: boolean;
    is_active: boolean;
    admin_assigned: boolean;
};
export async function validateHospitalAdminAssignment(
    call: grpc.ServerUnaryCall<ValidateHospitalAdminAssignmentRequest, ValidateHospitalAdminAssignmentResponse>,
    callback: grpc.sendUnaryData<ValidateHospitalAdminAssignmentResponse>
): Promise<void> {
    try {
        const hospitalIdSchema = z.string().min(1, "Hospital ID is required").uuid("Invalid hospital ID");
        const { hospital_id } = call.request;
        const validation = hospitalIdSchema.safeParse(hospital_id);

        if (!validation.success) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: validation.error.issues[0]?.message ?? "Invalid hospital ID"
            });
            return;
        }

        const response = { exists: false, is_active: false, admin_assigned: false };
        const hospital = await HosptialRepository.findHospitalById(hospital_id);

        if (hospital) {
            response.exists = true;
            response.is_active = hospital.status === "ACTIVE";
        }

        let isHospitalAlreadyAssigned = false;

        if (hospital) {
            isHospitalAlreadyAssigned =
                await HosptialRepository.checkHospitalAssignment(hospital_id);
        }

        response.admin_assigned = isHospitalAlreadyAssigned;

        callback(null, response);
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: 'Internal server error'
        });
    }
}

type AssignHospitalAdminRequest = {
    user_id: string;
    hospital_id: string;
};

type AssignHospitalAdminResponse = {
    assigned: boolean
}
export async function assignHospitalAdmin(
    call: grpc.ServerUnaryCall<AssignHospitalAdminRequest, AssignHospitalAdminResponse>,
    callback: grpc.sendUnaryData<AssignHospitalAdminResponse>
): Promise<void> {
    try {
        const userIdSchema = z.string().min(1, "User ID is required").uuid("Invalid user ID");
        const hospitalIdSchema = z.string().min(1, "Hospital ID is required").uuid("Invalid hospital ID");

        const { user_id, hospital_id } = call.request;

        const userValidation = userIdSchema.safeParse(user_id);

        if (!userValidation.success) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: userValidation.error.issues[0]?.message ?? "Invalid user ID"
            });
            return;
        }

        const hospitalValidation = hospitalIdSchema.safeParse(hospital_id);

        if (!hospitalValidation.success) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: hospitalValidation.error.issues[0]?.message ?? "Invalid hospital ID"
            });
            return;
        }

        const hospital = await HosptialRepository.findHospitalById(hospital_id);

        if (!hospital || hospital.status !== "ACTIVE") {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "Hospital not found or inactive"
            });
            return;
        }

        const res = await HosptialRepository.assignHospitalAdmin(user_id, hospital.id);

        if (!res) {
            callback({
                code: grpc.status.INTERNAL,
                message: "Failed to assign hospital admin"
            });
            return;
        }

        callback(null, { assigned: true });

    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: 'Internal server error'
        });
    }
}