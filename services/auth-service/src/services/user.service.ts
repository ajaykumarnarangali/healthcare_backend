import * as userRepository from "../repositories/user.repository.js";
import { type createPatientProfileBody } from "../contracts/user/schema.js";
import { APIError } from "../error/APIError.js";
import { retry } from "../utils/retry.js";
import { STATUS_CODES, USER_STATUS } from "../constants/index.js";
import { uploadImage, deleteImage } from "../utils/imageUpload.js";
import { logger } from "../utils/logger.js";


export async function createProfile(
    userId: string,
    profileData: createPatientProfileBody,
    file?: Express.Multer.File
) {
    const user = await userRepository.getUserById(userId);

    if (!user || user.status !== USER_STATUS.ACTIVE) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            'User not found or inactive'
        );
    }

    const existingProfile = await userRepository.isProfileExists(userId);

    if (existingProfile) {
        throw new APIError(
            STATUS_CODES.CONFLICT,
            'Profile already exists'
        );
    }

    let uploadedPublicId: string | null = null;

    try {
        const profile = {
            ...profileData,
            profile_photo: null as string | null,
            profile_photo_public_id: null as string | null,
        };

        if (file) {
            const { secure_url, public_id } = await retry(
                () => uploadImage(file.buffer, 'healthcare/profiles'),
                3,
                2000,
                'Cloudinary profile image upload'
            );

            profile.profile_photo = secure_url;
            profile.profile_photo_public_id = public_id;

            uploadedPublicId = public_id;
        }

        return await userRepository.createUserProfile(userId, profile);

    } catch (error) {

        if (uploadedPublicId) {
            try {
                await retry(
                    () => deleteImage(uploadedPublicId as string),
                    3,
                    2000,
                    'Cloudinary profile image deletion'
                );
            } catch (cleanupError) {
                logger.error(
                    { cleanupError, uploadedPublicId },
                    'Failed to clean up Cloudinary image after profile creation failure'
                );
            }
        }

        throw error;
    }
}