const FIFTEEN_MINUTES = 15 * 60 * 1000;

export type RateLimitEndpoint =
    | "patientRegister"
    | "doctorRegister"
    | "login"
    | "verifyEmail"
    | "refreshToken";

export type RateLimitConfig = {
    name: string,
    windowMs: number;
    limit: number;
    keyTypes: Array<"ip" | "email" | "userId">;
};
export const rateLimitConfig: Record<RateLimitEndpoint, RateLimitConfig> = {
    patientRegister: {
        name: "auth:patient-reg",
        windowMs: FIFTEEN_MINUTES,
        limit: 5,
        keyTypes: ["ip"],
    },

    doctorRegister: {
        name: "auth:doctor-reg",
        windowMs: FIFTEEN_MINUTES,
        limit: 5,
        keyTypes: ["ip"],
    },

    login: {
        name: "auth:login",
        windowMs: FIFTEEN_MINUTES,
        limit: 10,
        keyTypes: ["ip", "email"],
    },

    verifyEmail: {
        name: "auth:verify-email",
        windowMs: FIFTEEN_MINUTES,
        limit: 10,
        keyTypes: ["ip", "userId"],
    },

    refreshToken: {
        name: "auth:refresh",
        windowMs: FIFTEEN_MINUTES,
        limit: 10,
        keyTypes: ["ip"],
    },
} as const;