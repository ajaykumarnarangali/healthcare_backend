const FIFTEEN_MINUTES = 15 * 60 * 1000;

export type RateLimitEndpoint =
    | "createHospital";

export type RateLimitConfig = {
    name: string,
    windowMs: number;
    limit: number;
    keyTypes: Array<"ip" | "email" | "userId">;
};
export const rateLimitConfig: Record<RateLimitEndpoint, RateLimitConfig> = {
    //hospital routes
    createHospital: {
        name: "hospital:create",
        windowMs: FIFTEEN_MINUTES,
        limit: 5,
        keyTypes: ["ip"]
    }
    
} as const;