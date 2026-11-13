import zod from "zod";

export const createHospitalSchema = zod.object({
    // Hospital Information
    name: zod
        .string({ required_error: "Hospital name is required" })
        .trim()
        .min(2, "Hospital name must contain at least 2 characters")
        .max(255, "Hospital name cannot exceed 255 characters"),

    email: zod
        .string({ required_error: "Hospital email is required" })
        .trim()
        .email("Please provide a valid email address")
        .max(255, "Email cannot exceed 255 characters")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"),

    phone: zod
        .string({ required_error: "Hospital phone number is required" })
        .trim()
        .min(7, "Phone number must contain at least 7 characters")
        .max(20, "Phone number cannot exceed 20 characters")
        .regex(/^\+?[0-9\s()-]+$/, "Please provide a valid phone number"),

    website: zod
        .string()
        .trim()
        .max(255, "Website URL cannot exceed 255 characters")
        .regex(
            /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[^\s]*)?$/,
            "Please provide a valid website URL"
        )
        .optional(),

    description: zod
        .string()
        .trim()
        .max(5000, "Description cannot exceed 5000 characters")
        .optional(),

    // Hospital Address
    streetAddress: zod
        .string({ required_error: "Street address is required" })
        .trim()
        .min(3, "Street address must contain at least 3 characters")
        .max(255, "Street address cannot exceed 255 characters"),

    city: zod
        .string({ required_error: "City is required" })
        .trim()
        .min(2, "City must contain at least 2 characters")
        .max(100, "City cannot exceed 100 characters"),

    state: zod
        .string({ required_error: "State is required" })
        .trim()
        .min(2, "State must contain at least 2 characters")
        .max(100, "State cannot exceed 100 characters"),

    country: zod
        .string({ required_error: "Country is required" })
        .trim()
        .min(2, "Country must contain at least 2 characters")
        .max(100, "Country cannot exceed 100 characters"),

    postalCode: zod
        .string()
        .trim()
        .max(20, "Postal code cannot exceed 20 characters")
        .optional(),

    // Hospital Location
    latitude: zod
        .coerce
        .number({
            invalid_type_error: "Latitude must be a number",
        })
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .optional(),

    longitude: zod
        .coerce
        .number({
            invalid_type_error: "Longitude must be a number",
        })
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .optional(),

}).strict();

export type HospitalCreationBody = zod.infer<typeof createHospitalSchema>;

export const createHospitalResponse = zod.object({
    success: zod.boolean(),
    message: zod.string(),
});

export const updateHospitalSchema = createHospitalSchema.partial();
export const updateHospitalPathParam = zod.object({
    hospitalId: zod.string().uuid()
});
export type UpdateHospitalPathParam = zod.infer<typeof updateHospitalPathParam>;
export type HospitalUpdaionBody = zod.infer<typeof updateHospitalSchema>;
export const updateHospitalResponse = zod.object({
    success: zod.boolean(),
    message: zod.string(),
});

export const getHospitalPathParam = zod.object({
    hospitalId: zod.string().uuid()
})
export type GetHospitalPathParam = zod.infer<typeof getHospitalPathParam>;
const hospitalDetailsSchema = zod.object({
    name: zod.string(),
    email: zod.string(),
    phone: zod.string(),
    website: zod.string().nullable(),
    description: zod.string().nullable(),
    hospitalImage: zod.string().nullable(),
    status: zod.enum(["ACTIVE", "INACTIVE"]),
    streetAddress: zod.string(),
    city: zod.string(),
    state: zod.string(),
    country: zod.string(),
    postalCode: zod.string().nullable(),
    latitude: zod.number().nullable(),
    longitude: zod.number().nullable()
});
export const getHospitalResponse = zod.object({
    success: zod.boolean(),
    message: zod.string(),
    data: zod.object({
        hospitalDetails: hospitalDetailsSchema
    })
});