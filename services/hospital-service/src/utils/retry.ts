import { logger } from "./logger.js";
const delay = (delayMs: number) => {
    return new Promise((resolve) =>
        setTimeout(resolve, delayMs)
    );
}


export async function retry<T>(
    fn: () => T | Promise<T>,
    retries: number,
    delayMs: number,
    operation: string
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) {
            logger.error(
                { error, operation },
                "Operation failed after all retries"
            );

            throw error;
        }

        logger.warn(
            { error, operation, retriesLeft: retries },
            "Operation failed, retrying"
        );

        await delay(delayMs);

        return retry(fn, retries - 1, delayMs, operation);
    }
}