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
