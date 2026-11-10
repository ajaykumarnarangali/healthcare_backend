import {
    type ServerUnaryCall,
    type sendUnaryData,
    status,
} from '@grpc/grpc-js';
import * as userService from "../../services/user.service.js";

interface GetUserRequest {
    user_id: string;
}

interface GetUserResponse {
    user_id: string;
    email: string;
    role: string,
    status: string
}

export const getUser = async (
    call: ServerUnaryCall<GetUserRequest, GetUserResponse>,
    callback: sendUnaryData<GetUserResponse>
): Promise<void> => {
    try {
        const userId = call.request.user_id;

        // Actual business logic through service layer
        const user = await userService.getUserVerificationInfo(userId);

        if (!user) {
            callback({
                code: status.NOT_FOUND,
                message: 'User not found',
            });
            return;
        }

        callback(null, {
            user_id: user.id,
            email: user.email,
            role: user.role,
            status: user.status
        });
    } catch (error) {
        callback({
            code: status.INTERNAL,
            message: 'Internal server error',
        });
    }
};