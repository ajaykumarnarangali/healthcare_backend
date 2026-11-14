import * as hospitalRepository from "../repositories/hospital.repository.js";
import { APIError } from "../error/APIError.js";
import { retry } from "../utils/retry.js";
import { STATUS_CODES, type UserRole } from "../constants/index.js";
import { uploadImage, deleteImage } from "../utils/imageUpload.js";
import { logger } from "../utils/logger.js";
import {
    type HospitalCreationBody,
    type HospitalUpdaionBody,
    type GetHospitalsPathParam
} from "../contracts/hospital/schema.js";

interface HospitalCreationData extends HospitalCreationBody {
    image_url?: string;
    image_public_id?: string;
}

export async function createHospital(hospitalData: HospitalCreationBody, hospitalImage?: Express.Multer.File) {

    const hospitalCreationData: HospitalCreationData = { ...hospitalData };
    let publicImageUrl: string | undefined;

    const isHospitalExist = await hospitalRepository.findHospitalByEmail(hospitalData.email);
    if (isHospitalExist) {
        throw new APIError(STATUS_CODES.CONFLICT, "Hospital already exist");
    }

    if (hospitalImage) {
        const { secure_url, public_id } = await retry(
            () => uploadImage(hospitalImage.buffer, "healthcare/hospitals"),
            3,
            3000,
            "Hospital image upload"
        );
        hospitalCreationData.image_url = secure_url;
        hospitalCreationData.image_public_id = public_id;
        publicImageUrl = public_id;
    }

    try {

        const hospital = await hospitalRepository.createHospital(hospitalCreationData);
        logger.info(
            { hospitalId: hospital.id, email: hospital.email },
            "Hospital created successfully"
        );

    } catch (error) {
        logger.error(
            { err: error, email: hospitalCreationData.email },
            "Failed to create hospital"
        );

        if (publicImageUrl) {
            try {
                await retry(
                    () => deleteImage(publicImageUrl!),
                    3,
                    3000,
                    "Hospital image deletion"
                );
            } catch (cleanupError) {
                logger.error(
                    { err: cleanupError, publicImageUrl },
                    "Failed to delete hospital image during cleanup"
                );
            }
        }

        throw error;
    }
}

interface HospitalUpdationData extends HospitalUpdaionBody {
    image_url?: string;
    image_public_id?: string;
}
export async function updateHospital(hospitalId: string, hospitalData: HospitalUpdationData,
    hospitalImage?: Express.Multer.File) {

    const hospitalUpdationData: HospitalUpdationData = { ...hospitalData };

    const isHospitalExist = await hospitalRepository.findHospitalById(hospitalId);
    if (!isHospitalExist) {
        throw new APIError(STATUS_CODES.NOT_FOUND, "Hospital is not exist");
    }

    let newPublicImageId: string | undefined;
    let oldImagePublicId: string | undefined = isHospitalExist.image_public_id ?? undefined;

    if (hospitalImage) {
        const { secure_url, public_id } = await retry(
            () => uploadImage(hospitalImage.buffer, "healthcare/hospitals"),
            3,
            3000,
            "Hospital image upload"
        );
        hospitalUpdationData.image_url = secure_url;
        hospitalUpdationData.image_public_id = public_id;
        newPublicImageId = public_id;
    }

    try {
        const updatedHospital = await hospitalRepository.updateHospital(
            hospitalId,
            hospitalUpdationData
        );

        if (!updatedHospital) {
            throw new APIError(
                STATUS_CODES.NOT_FOUND,
                'Hospital not found or update failed'
            );
        }
    } catch (error) {
        if (newPublicImageId) {
            try {
                await retry(
                    () => deleteImage(newPublicImageId),
                    3,
                    3000,
                    "New hospital image cleanup after update failure"
                );
            } catch (cleanupError) {
                logger.error(
                    { cleanupError, newPublicImageId },
                    'Failed to clean up New Cloudinary image after Hospital updation failure'
                );
            }
        }
        throw error;
    }

    if (oldImagePublicId && newPublicImageId) {
        try {
            await retry(
                () => deleteImage(oldImagePublicId),
                3,
                3000,
                "Old hospital image cleanup after update success"
            );
        } catch (cleanupError) {
            logger.error(
                { cleanupError, oldImagePublicId },
                'Failed to clean up old Cloudinary image after hospital update'
            );
        }
    }
}

export async function getHospital(hospitalId: string, role: UserRole) {

    // TODO: Verify HOSPITAL_ADMIN hospital assignment.
    // TODO: Verify DOCTOR hospital association.

    const status: string | null =
        role === "PATIENT" ? "ACTIVE" : null;

    const hospitalDetails = await hospitalRepository.getHospitalDetailsById(hospitalId, status);
    if (!hospitalDetails) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            "Hospital not found"
        );
    }

    return hospitalDetails;
}

export async function getHospitals(query: GetHospitalsPathParam) {
    const {
        search,
        sortBy,
        sortOrder,
        limit,
        page,
        status
    } = query;

    let searchTerm = "%";

    if (search) {
        searchTerm = `%${search}%`;
    }
    const allowedSortColumns = ["name", "city", "created_at"] as const;
    const allowedSortOrders = ["ASC", "DESC"] as const;


    if (!allowedSortColumns.includes(sortBy)) {
        throw new APIError(STATUS_CODES.BAD_REQUEST, "Invalid sort column");
    }

    if (!allowedSortOrders.includes(sortOrder)) {
        throw new APIError(STATUS_CODES.BAD_REQUEST, "Invalid sort order");
    }

    const updatedQuery: GetHospitalsPathParam = {
        ...query, search: searchTerm,
        limit: Number(limit) || 10,
        page: Number(page) || 1,
        status: status || "ALL"
    }
    const hospitalCount = await hospitalRepository.getHospitalCount();
    const hospitalsData = await hospitalRepository.getHospitalsByQuery(updatedQuery);

    return {
        hospitals: hospitalsData,
        pagination: {
            totalRecords: hospitalCount,
            totalPages: Math.ceil(hospitalCount / query.limit),
            currentPage: query.page,
            limit: query.limit
        }
    };
}