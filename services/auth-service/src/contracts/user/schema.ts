import { z } from 'zod';

export const createPatientProfileSchema = z.object({
    firstName: z.string()
        .trim()
        .min(1, 'First name is required')
        .max(100, 'First name must not exceed 100 characters'),

    lastName: z.string()
        .trim()
        .max(100, 'Last name must not exceed 100 characters')
        .optional(),

    phone: z.string()
        .trim()
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number must not exceed 20 characters')
        .regex(/^\+?[0-9]+$/, 'Invalid phone number format'),

    dateOfBirth: z.coerce.date(),

    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
        required_error: 'Gender is required',
        invalid_type_error: 'Please select a valid gender',
    }),

    streetAddress: z.string()
        .trim()
        .max(255, 'Street address must not exceed 255 characters')
        .optional(),

    city: z.string()
        .trim()
        .max(100, 'City must not exceed 100 characters')
        .optional(),

    state: z.string()
        .trim()
        .max(100, 'State must not exceed 100 characters')
        .optional(),

    country: z.string()
        .trim()
        .max(100, 'Country must not exceed 100 characters')
        .optional(),

    postalCode: z.string()
        .trim()
        .max(20, 'Postal code must not exceed 20 characters')
        .optional(),
}).strict();

export const profileResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        profile: z.object({
            userId: z.string().uuid(),
            firstName: z.string(),
            lastName: z.string().nullable(),
            phone: z.string(),
            dateOfBirth: z.string(),
            gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
            profilePhoto: z.string().nullable(),
            streetAddress: z.string().nullable(),
            city: z.string().nullable(),
            state: z.string().nullable(),
            country: z.string().nullable(),
            postalCode: z.string().nullable(),
            profileCompleted: z.boolean(),
        }),
    }),
});

export const createProfileResponseSchema = profileResponseSchema
export const getProfileResponseSchema = profileResponseSchema;

export type createPatientProfileBody =
    z.infer<typeof createPatientProfileSchema>;

export const updatePatientProfileSchema =
    createPatientProfileSchema.partial().strict();

export const updatePatientProfileResponseSchema = profileResponseSchema

export type updatePatientProfileBody =
    z.infer<typeof updatePatientProfileSchema>;