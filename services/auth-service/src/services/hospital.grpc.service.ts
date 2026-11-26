import grpc from '@grpc/grpc-js';
import hospitalClient from '../grpc/client/hospital.grpc.client.js';

type ValidateHospitalAdminAssignmentResponse = {
    exists: boolean;
    is_active: boolean;
    admin_assigned: boolean;
};
export function getHospitalAdminAssignment(hospitalId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        hospitalClient.ValidateHospitalAdminAssignment(
            { hospital_id: hospitalId },
            (error: grpc.ServiceError | null, response: ValidateHospitalAdminAssignmentResponse) => {
                if (error) {
                    return reject(error);
                }

                resolve(response);
            }
        );
    });
}

type AssignHospitalAdminResponse = {
    assigned: boolean
}
export function assignHospitalAdmin(user_id: string, hospital_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        hospitalClient.AssignHospitalAdmin(
            { user_id, hospital_id },
            (error: grpc.ServiceError | null, response: AssignHospitalAdminResponse) => {
                if (error) {
                    return reject(error);
                }

                resolve(response);
            }
        );
    })
}