import { APIError } from "../error/APIError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import * as userService from "../services/user.service.js";
import type {
    createProfileRequest,
    emptyRequest
} from "../contracts/user/types.js";


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