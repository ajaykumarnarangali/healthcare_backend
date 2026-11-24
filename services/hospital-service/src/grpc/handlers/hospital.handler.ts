import grpc from '@grpc/grpc-js';

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
        const { hospital_id } = call.request;



        callback(null, {
            exists: true,
            is_active: true,
            admin_assigned: false
        });
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: 'Internal server error'
        });
    }
}