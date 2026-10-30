import multer from 'multer';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import type { Request, Response, NextFunction } from 'express';
import { APIError } from '../../error/APIError.js';
import { STATUS_CODES } from "../../constants/statusCodes.js";

const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
];

export const uploadSingleFile = (fieldName: string) => {

    const upload = multer({
        storage: multer.memoryStorage(),

        limits: {
            fileSize: 2 * 1024 * 1024,
            files: 1,
        },

        fileFilter: (req, file, cb) => {
            if (!allowedTypes.includes(file.mimetype)) {
                return cb(new APIError(
                    STATUS_CODES.BAD_REQUEST,
                    'Only JPEG, PNG and WebP images are allowed'
                ));
            }

            cb(null, true);
        },
    }).single(fieldName);

    return (req: Request, res: Response, next: NextFunction) => {

        upload(req, res, async (error) => {
            try {
                if (error) {
                    console.log("multer error ", error)
                    return next(new APIError(
                        STATUS_CODES.BAD_REQUEST,
                        'Unable to process the uploaded image'
                    ));
                }

                if (!req.file) {
                    return next();
                }

                const detectedType = await fileTypeFromBuffer(req.file.buffer);

                if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
                    return next(new APIError(
                        STATUS_CODES.BAD_REQUEST,
                        'Invalid image file format. Only JPEG, PNG and WebP images are allowed.'
                    ));
                }

                const metadata = await sharp(req.file.buffer).metadata();

                if (!metadata.width || !metadata.height) {
                    throw new APIError(
                        STATUS_CODES.BAD_REQUEST,
                        'Invalid image dimensions'
                    );
                }

                const processedBuffer = await sharp(req.file.buffer, {
                    limitInputPixels: 20_000_000,
                })
                    .rotate()
                    .resize(500, 500, {
                        fit: 'inside',
                        withoutEnlargement: true,
                    })
                    .webp({ quality: 80 })
                    .toBuffer();

                req.file.buffer = processedBuffer;
                req.file.mimetype = 'image/webp';
                req.file.size = processedBuffer.length;
                req.file.originalname = `${Date.now()}.webp`;

                next();

            } catch (error) {
                if (error instanceof APIError) {
                    return next(error);
                }

                return next(new APIError(
                    STATUS_CODES.BAD_REQUEST,
                    'Unable to process the uploaded image'
                ));
            }
        });
    };
};