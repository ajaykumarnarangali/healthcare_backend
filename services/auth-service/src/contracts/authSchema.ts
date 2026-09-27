import zod from "zod";

export const loginBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
});

export const loginResponseSchema = zod.object({
    success: zod.boolean(),
    message: zod.string(),
    accessToken: zod.string(),
});