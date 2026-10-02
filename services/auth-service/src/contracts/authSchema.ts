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
});

export type PatientRegisterBody =
    zod.infer<typeof patientRegisterBodySchema>;

export const patientRegisterResponseSchema = zod.object({
    success: zod.boolean(),
    message: zod.string(),
});

export const loginBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
});

export const loginResponseSchema = zod.object({
    success: zod.boolean(),
    message: zod.string(),
    accessToken: zod.string(),
});