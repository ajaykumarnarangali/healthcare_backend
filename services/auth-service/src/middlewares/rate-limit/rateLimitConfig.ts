const FIFTEEN_MINUTES = 15 * 60 * 1000;

export type RateLimitEndpoint =
    | "patientRegister"
    | "doctorRegister"
    | "login"
    | "verifyEmail"
    | "refreshToken"
    | "getMe"
    | "signOut"
    | "createProfile";

export type RateLimitConfig = {
    name: string,
    windowMs: number;
    limit: number;
    keyTypes: Array<"ip" | "email" | "userId">;
};
export const rateLimitConfig: Record<RateLimitEndpoint, RateLimitConfig> = {
    //auth routes
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

    getMe: {
        name: "auth:me",
        windowMs: FIFTEEN_MINUTES,
        limit: 10,
        keyTypes: ["ip", "userId"],
    },

    signOut: {
        name: "auth:signout",
        windowMs: FIFTEEN_MINUTES,
        limit: 10,
        keyTypes: ["ip", "userId"],
    },

    // user routes
    createProfile: {
        name: "create:profile",
        windowMs: FIFTEEN_MINUTES,
        limit: 10,
        keyTypes: ["ip", "userId"],
    }
} as const;