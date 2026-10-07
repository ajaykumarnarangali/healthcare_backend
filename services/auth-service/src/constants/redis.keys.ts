export const REDIS_KEYS = {
    emailVerification: (userId: string) =>
        `email-verification:${userId}`,

    refreshToken: (jti: string) =>
        `auth:refresh:${jti}`,
};