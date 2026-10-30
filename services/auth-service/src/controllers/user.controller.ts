import { APIError } from "../error/APIError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import * as userService from "../services/user.service.js";
import type {
    createProfileRequest
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
        status: 201,
        body: {
            success: true,
            message: "Profile statistics created successfully",
            data: {
                profile
            }
        }
    }
}