import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'node:crypto';
import { APIError } from '../error/APIError.js';
import { STATUS_CODES } from "../constants/statusCodes.js";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing required Cloudinary environment variables');
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
});

interface UploadedImage {
    secure_url: string;
    public_id: string;
}

export async function uploadImage(
    buffer: Buffer,
    folder: string
): Promise<UploadedImage> {

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                format: 'webp',
                public_id: randomUUID(),
            },
            (error, result) => {
                if (error) {
                    return reject(
                        new APIError(
                            STATUS_CODES.INTERNAL_SERVER_ERROR,
                            'Failed to upload profile image'
                        )
                    );
                }

                if (!result) {
                    return reject(
                        new APIError(
                            STATUS_CODES.INTERNAL_SERVER_ERROR,
                            'Image upload failed'
                        )
                    );
                }

                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        ).end(buffer);
    });
}

export async function deleteImage(publicId: string): Promise<void> {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
        });

        if (result.result !== 'ok' && result.result !== 'not found') {
            throw new APIError(
                STATUS_CODES.INTERNAL_SERVER_ERROR,
                'Failed to delete profile image'
            );
        }
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }

        throw new APIError(
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            'Failed to delete profile image'
        );
    }
}