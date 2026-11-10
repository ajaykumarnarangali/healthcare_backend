import grpc from '@grpc/grpc-js';
import userClient from '../grpc/client/user.grpc.client.js';

interface GetUserResponse {
    user_id: string;
    first_name: string;
    email: string;
    role: string,
    status: string
}
export function getUser(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        userClient.getUser(
            { user_id: userId },
            (error: grpc.ServiceError | null, response: GetUserResponse) => {
                if (error) {
                    return reject(error);
                }

                resolve(response);
            }
        );
    });
}