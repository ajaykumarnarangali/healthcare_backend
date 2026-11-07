import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient>;

export async function connectRedis() {
    try {
        const url = process.env.REDIS_URL;

        if (!url) {
            throw new Error("REDIS_URL is not configured");
        }

        redisClient = createClient({
            url,
        });

        redisClient.on("error", (error) => {
            console.error("Redis error:", error);
        });

        await redisClient.connect();

        console.log("Connected to Redis");
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        throw error;
    }
}

export function getRedisClient() {
    if (!redisClient) {
        throw new Error("Redis is not initialized");
    }

    return redisClient;
}