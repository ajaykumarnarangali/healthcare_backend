import zod from "zod";

export const patientRegisterBodySchema = zod.object({
    email: zod
        .string()
        .trim()
        .toLowerCase()
        .email()
        .max(255),

    password: zod
        .string()
        .min(8)
        .max(128)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
        ),
}).strict();

export type PatientRegisterBody =
    zod.infer<typeof patientRegisterBodySchema>;


export const doctorRegisterBodySchema = zod.object({
    email: zod
        .string()
        .trim()
        .toLowerCase()
        .email()
        .max(255),
    password: zod
        .string()
        .min(8)
        .max(128)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
        ),
    licenseNumber: zod
        .string()
        .trim()
        .min(1, "License number is required")
        .length(10, "License number must be exactly 10 characters")
}).strict();

export type DoctorRegisterBody =
    zod.infer<typeof doctorRegisterBodySchema>;


export const RegisterResponseSchema = zod.object({
    success: zod.boolean(),
    message: zod.string(),
});

export const verifyEmailSchema = zod.object({
    userId: zod.string().uuid(),
    token: zod.string().min(1),
}).strict();


export const verifyEmailResponseSchema = zod.object({
    success: zod.boolean(),
    message: zod.string(),
});

export type verifyEmailQuery = zod.infer<typeof verifyEmailSchema>;


export const loginBodySchema = zod.object({
    email: zod
        .string()
        .trim()
        .toLowerCase()
        .email()
        .max(255),
    password: zod
        .string()
        .min(8)
        .max(128)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
        )
}).strict();

export const loginResponseSchema = zod.object({
    success: zod.boolean(),
    message: zod.string(),
    accessToken: zod.string(),
    role: zod.string()
});

export type UserLoginBody =
    zod.infer<typeof doctorRegisterBodySchema>;