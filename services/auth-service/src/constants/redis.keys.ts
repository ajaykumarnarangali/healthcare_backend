export const REDIS_KEYS = {
    emailVerification: (userId: string) =>
        `email-verification:${userId}`,
};