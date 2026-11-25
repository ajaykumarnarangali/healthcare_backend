import { APIError } from "../error/APIError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import * as userService from "../services/user.service.js";
import type {
    emptyRequest,
    createProfileRequest,
    updateProfileRequest,
    getUserByQueryRequest,
    inviteHospitalAdminRequest
} from "../contracts/user/types.js";
import { getUsersQuerySchema } from "../contracts/user/schema.js";


export async function createProfile(req: createProfileRequest) {

    const userId = req.user!.userId;
    const profileData = req.body;
    const profilePhoto = req.file;

    const profile = await userService.createProfile(
        userId,
        profileData,
        profilePhoto
    );

    return {
        status: STATUS_CODES.CREATED,
        body: {
            success: true,
            message: "Profile statistics created successfully",
            data: {
                profile
            }
        }
    }
}

export async function updateProfile(req: updateProfileRequest) {
    const userId = req.user!.userId;
    const profileData = req.body;
    const profilePhoto = req.file;

    if (Object.keys(profileData).length === 0 && !profilePhoto) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            'At least one profile field or image must be provided'
        );
    }

    const profile = await userService.updateProfile(
        userId,
        profileData,
        profilePhoto
    );

    return {
        status: STATUS_CODES.CREATED,
        body: {
            success: true,
            message: "Profile statistics created successfully",
            data: {
                profile
            }
        }
    }
}

export async function getProfile(req: emptyRequest) {
    const userId = req.user!.userId;
    const body = req.body;

    if (body && Object.keys(body).length > 0) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "This endpoint does not accept a request body."
        );
    }

    const profile = await userService.getProfile(userId);
    return {
        status: STATUS_CODES.OK,
        body: {
            success: true,
            message: "Profile statistics fetched successfully",
            data: {
                profile
            }
        }
    }
}

export async function getUsersByQuery(req: getUserByQueryRequest) {
    const query = req.query;
    const result = getUsersQuerySchema.parse(query);
    const { users, pagination } = await userService.getUsersByQuery(result);

    return {
        status: STATUS_CODES.OK,
        body: {
            success: true,
            message: "Users fetched successfully",
            data: {
                users,
                pagination
            }
        }
    };
}

export async function inviteHospitalAdmin(req: inviteHospitalAdminRequest) {
    const { userId } = req.user!;
    const payLoad = req.body;

    if (payLoad.email !== payLoad.confirmEmail) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            'Email addresses do not match'
        );
    }

    await userService.inviteHospitalAdmin(userId, payLoad);

    return {
        status: 201,
        body: {
            succes: true,
            message: "User Invited Successfully"
        }
    }
}