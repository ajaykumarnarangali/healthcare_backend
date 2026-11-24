import * as userRepository from "../repositories/user.repository.js";
import * as hospitalService from "../services/hospital.grpc.service.js";
import { hashVerificationToken, generateVerificationToken } from "../utils/token.utils.js";
import { APIError } from "../error/APIError.js";
import { retry } from "../utils/retry.js";
import { STATUS_CODES, USER_ROLES, USER_STATUS } from "../constants/index.js";
import { uploadImage, deleteImage } from "../utils/imageUpload.js";
import { logger } from "../utils/logger.js";
import {
    type adminInviteBody,
    type createPatientProfileBody,
    type GetUsersPathParam,
    type updatePatientProfileBody
} from "../contracts/user/schema.js";


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

type UpdateProfileData = updatePatientProfileBody & {
    profile_photo?: string;
    profile_photo_public_id?: string;
};
export async function updateProfile(
    userId: string,
    profileData: updatePatientProfileBody,
    file?: Express.Multer.File
) {

    const user = await userRepository.getUserById(userId);

    if (!user || user.status !== USER_STATUS.ACTIVE) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            'User not found or inactive'
        );
    }

    const profile = await userRepository.getProfileByUserId(userId);

    if (!profile || !profile.firstName) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            'Profile has not been created yet'
        );
    }

    let updateProfileData: UpdateProfileData = { ...profileData };

    let uploadedPublicId: string | null = null;
    let oldImagePublicId: string | null = profile.profilePhotoPublicId ?? null;

    if (file) {
        const { secure_url, public_id } = await retry(
            () => uploadImage(file.buffer, 'healthcare/profiles'),
            3,
            2000,
            'Cloudinary profile image upload'
        );

        uploadedPublicId = public_id;

        updateProfileData.profile_photo = secure_url;
        updateProfileData.profile_photo_public_id = public_id;
    }

    let newProfile;
    try {
        newProfile = await userRepository.updateUserProfileById(userId, updateProfileData);
        if (!newProfile) {
            throw new APIError(
                STATUS_CODES.NOT_FOUND,
                'Profile update failed'
            );
        }
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

    if (uploadedPublicId && oldImagePublicId) {
        try {
            await retry(
                () => deleteImage(oldImagePublicId),
                3,
                2000,
                'Cloudinary old profile image deletion'
            );
        } catch (cleanupError) {
            logger.error(
                { cleanupError, oldImagePublicId },
                'Failed to delete old profile image'
            );
        }
    }
    return newProfile;
}

export async function getProfile(userId: string) {
    const user = await userRepository.getUserById(userId);

    if (!user || user.status !== USER_STATUS.ACTIVE) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            'User not found or inactive'
        );
    }

    const profile = await userRepository.getProfileByUserId(userId);

    if (!profile || !profile.firstName) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            'Profile has not been created yet'
        );
    }

    return profile;
}

export async function getUserVerificationInfo(userId: string) {
    const user = await userRepository.getUserById(userId);

    if (!user || user.status !== USER_STATUS.ACTIVE) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            'User not found or inactive'
        );
    }

    return user;
}

export async function getUsersByQuery(query: GetUsersPathParam) {
    const {
        role,
        page,
        search,
        status,
    } = query;

    let searchTerm = "%";

    if (search) {
        searchTerm = `%${search}%`;
    }

    type UpdatedUserQuery = Omit<GetUsersPathParam, "page" | "limit"> & {
        page: number;
        limit: number;
    };
    const updatedQuery: UpdatedUserQuery = {
        ...query,
        search: searchTerm,
        limit: Math.min(Number(query.limit) || 10, 50),
        page: Number(page) || 1,
        status: status || "ALL"
    };

    // DOCTOR
    // doctor id, firstName ,lastName,from this service
    // speciality,isLicenseVerified from docotro service
    //hospitalAffiliations from hosptial servcie

    //PATIENT
    //id, firstName ,lastName, registeredAt,status from this service
    //appointmentCount from appointment service

    //HOSPITAL_ADMIN
    //id,firstName,lastName,email,phone,isProfileCompleted,status from this service
    //assignedHospital from hospital service

    const [
        totalUserCountResult,
        usersResult,
        filteredUserCountResult
    ] = await Promise.allSettled([
        userRepository.getUserCountByRole(role),
        userRepository.getUsersByQuery(updatedQuery),
        userRepository.getUsersCountByQuery(updatedQuery)
    ]);

    if (usersResult.status === "rejected") {
        throw new APIError(
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            "Failed to fetch users"
        );
    }
    const usersData = usersResult.value;
    const userIds = usersData.map((data) => data.id);

    const totalUserCount =
        totalUserCountResult.status === "fulfilled" ? totalUserCountResult.value : 0;
    const filteredUserCount =
        filteredUserCountResult.status === "fulfilled" ? filteredUserCountResult.value : 0;


    switch (role) {
        case "DOCTOR": {
            //need to do further service call when done that part
            break;
        }
        case "PATIENT": {
            //need to do further service call when done that part
            break;
        }
        case "HOSPITAL_ADMIN": {
            //need to do further service call when done that part
            break;
        }
        default:
            throw new APIError(
                STATUS_CODES.BAD_REQUEST,
                "Invalid user role"
            );
    }

    const totalPages = filteredUserCount
        ? Math.ceil(filteredUserCount / updatedQuery.limit)
        : 0;


    return {
        users: usersData,
        pagination: {
            totalRecords: totalUserCount,
            totalQueryMatchRecords: filteredUserCount,
            totalPages,
            currentPage: updatedQuery.page,
            limit: updatedQuery.limit
        }
    };
}

export async function inviteHospitalAdmin(userId: string, payLoad: adminInviteBody) {

    const user = await userRepository.getUserById(userId);
    const {
        email,
        name,
        hospital_id
    } = payLoad;

    if (!user || user.status !== USER_STATUS.ACTIVE) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            'User not found or inactive'
        );
    }

    if (user.role != USER_ROLES.GLOBAL_ADMIN) {
        throw new APIError(
            STATUS_CODES.FORBIDDEN,
            'Permission denied'
        );
    }

    const [existInvitedUser, existInvitation] = await Promise.all([
        userRepository.getUser(email),
        userRepository.getInvitationByEmailOrHospitalId(email, hospital_id)
    ]);

    if (existInvitedUser || existInvitation) {
        throw new APIError(
            STATUS_CODES.CONFLICT,
            'Unable to process this invitation'
        );
    }

    const response = await hospitalService.getHospitalAdminAssignment(hospital_id);

    console.log("hospital admin response", response);

    const token = generateVerificationToken();
    const hashedToken = hashVerificationToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const invitationData = {
        name,
        email,
        token_hash: hashedToken,
        invited_by: user.id,
        hospital_id,
        status: 'PENDING',
        expires_at: expiresAt
    }

}