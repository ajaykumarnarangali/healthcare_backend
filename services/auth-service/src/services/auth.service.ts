import bcrypt from "bcrypt";
import crypto from "crypto";
import { APIError } from "../error/APIError.js";
import { retry } from "../utils/retry.js";
import * as userRepository from "../repositories/user.repository.js";
import { getRabbitMQChannel, getRedisClient } from "../loaders/init.js";
import { USER_STATUS } from "../constants/user.constants.js";
import { logger } from "../utils/logger.js";
import {
    USER_ROLES,
    REDIS_KEYS,
    STATUS_CODES,
    RABBITMQ_EXCHANGE,
    USER_EMAIL_VERIFICATION_REQUESTED,
} from "../constants/index.js";
import {
    verifyJWTToken,
    generateJWTToken,
    hashVerificationToken,
    generateVerificationToken
} from "../utils/token.utils.js";


export async function registerPatient(email: string, password: string) {
    logger.info({ email }, "Patient registration started");

    const existingUser = await userRepository.getUser(email);

    if (existingUser) {
        logger.warn(
            { email },
            "Patient registration attempted with existing email"
        );
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "Unable to complete registration. Please check your details or try another email."
        );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await userRepository.createUser(
        email,
        passwordHash,
        USER_ROLES.PATIENT
    );

    logger.info(
        { userId: user.id },
        "Patient user created successfully"
    );

    const verificationToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(verificationToken);

    const redisClient = getRedisClient();

    await retry(
        () =>
            redisClient.set(
                REDIS_KEYS.emailVerification(user.id),
                tokenHash,
                {
                    EX: 900,
                }
            ),
        3,
        2000,
        "Store email verification token in Redis"
    );

    logger.info(
        { userId: user.id },
        "Email verification token stored in Redis"
    );

    const rabbitChannel = getRabbitMQChannel();

    const eventId = crypto.randomUUID();
    await retry(
        () =>
            rabbitChannel.publish(
                RABBITMQ_EXCHANGE,
                USER_EMAIL_VERIFICATION_REQUESTED,
                Buffer.from(
                    JSON.stringify({
                        eventId,
                        userId: user.id,
                        email: user.email,
                        verificationToken,
                    })
                )
            ),
        3,
        2000,
        "Publish email verification event"
    );

    logger.info(
        { userId: user.id },
        "Email verification event published"
    );

    return user;
}

export async function verifyLicenseNumber(
    email: string,
    licenseNumber: string
): Promise<boolean> {
    return userRepository.doctorLicenseExists(email, licenseNumber);
}

export async function registerDoctor(email: string, password: string) {

    const existingUser = await userRepository.getUser(email);

    if (existingUser) {
        logger.warn(
            { email },
            "Patient registration attempted with existing email"
        );
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "Unable to complete registration. Please check your details or try another email."
        );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await userRepository.createUser(
        email,
        passwordHash,
        USER_ROLES.DOCTOR
    );

    logger.info(
        { userId: user.id },
        "Patient user created successfully"
    );

    const verificationToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(verificationToken);

    const redisClient = getRedisClient();

    await retry(
        () =>
            redisClient.set(
                REDIS_KEYS.emailVerification(user.id),
                tokenHash,
                {
                    EX: 900,
                }
            ),
        3,
        2000,
        "Store doctor email verification token in Redis"
    );

    logger.info(
        { userId: user.id },
        "Email verification token stored in Redis"
    );

    const rabbitChannel = getRabbitMQChannel();
    const eventId = crypto.randomUUID();
    await retry(
        () =>
            rabbitChannel.publish(
                RABBITMQ_EXCHANGE,
                USER_EMAIL_VERIFICATION_REQUESTED,
                Buffer.from(
                    JSON.stringify({
                        eventId,
                        userId: user.id,
                        email: user.email,
                        verificationToken,
                    })
                )
            ),
        3,
        2000,
        "Publish doctor email verification event"
    );

    logger.info(
        { userId: user.id },
        "Email verification event published"
    );

    return user;
}

export async function verifyEmail(userId: string, token: string, password: string) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "Invalid verification request"
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "Invalid verification request"
        );
    }

    if (user.email_verified) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "Email is already verified"
        );
    }

    const redisKey = REDIS_KEYS.emailVerification(userId);
    const redisClient = getRedisClient();

    const storedTokenHash = await retry(
        () => redisClient.get(redisKey),
        3,
        2000,
        "Get email verification token from Redis"
    );

    if (!storedTokenHash) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "Verification token has expired"
        );
    }

    const hashedToken = hashVerificationToken(token);

    if (hashedToken !== storedTokenHash) {
        throw new APIError(
            STATUS_CODES.BAD_REQUEST,
            "Verification token is not matching"
        );
    }

    await userRepository.verifyUser(userId);

    await retry(
        () => redisClient.del(redisKey),
        3,
        2000,
        "Delete email verification token from Redis"
    );

    logger.info({ userId }, "Email verified successfully");
}

export async function login(email: string, password: string) {

    const DUMMY_PASSWORD_HASH =
        "$2b$12$pLQCXLmgoHa48ZY5qH8hQeWFevmKdV.W9GlnZRNt6XOiGx.5XDy5y";

    const user = await userRepository.getUser(email);

    const passwordHash = user?.password_hash ?? DUMMY_PASSWORD_HASH;

    const isPasswordValid = await bcrypt.compare(
        password,
        passwordHash
    );

    if (!user || !isPasswordValid || !user.email_verified || user.status !== USER_STATUS.ACTIVE) {
        throw new APIError(
            STATUS_CODES.UNAUTHORIZED,
            "Invalid email or password"
        );
    }

    const permissions = await userRepository.getUserPermissions(user.role);

    const tokenPayLoad = {
        sub: user.id,
        role: user.role
    }

    const { token: accessToken } = generateJWTToken(tokenPayLoad);
    const { token: refreshToken, jti } = generateJWTToken(tokenPayLoad, "refresh");

    const redisKey = REDIS_KEYS.refreshToken(jti);
    const redisClient = getRedisClient();
    const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60;

    await retry(
        () =>
            redisClient.set(
                redisKey,
                user.id,
                { EX: REFRESH_TOKEN_EXPIRY }
            ),
        3,
        2000,
        "Store refresh token in Redis"
    );

    return {
        permissions,
        accessToken,
        refreshToken,
        role: user.role,
        userId: user.id
    }
}

export async function refresh(refreshToken: string) {

    const decoded = verifyJWTToken(refreshToken, "refresh");

    if (typeof decoded === "string" || !decoded.jti || !decoded.sub) {
        throw new APIError(
            STATUS_CODES.UNAUTHORIZED,
            "Invalid refresh token payload"
        );
    }

    const redisKey = REDIS_KEYS.refreshToken(decoded.jti);
    const redisClient = getRedisClient();

    const userId = await retry(
        () => redisClient.get(redisKey),
        3,
        2000,
        "Retrieve refresh token from Redis"
    );

    if (!userId || userId !== decoded.sub) {
        throw new APIError(
            STATUS_CODES.UNAUTHORIZED,
            "Please sign in again to continue"
        );
    }

    const user = await userRepository.getUserById(userId);

    if (!user || user.status !== "ACTIVE") {
        throw new APIError(
            STATUS_CODES.UNAUTHORIZED,
            "Please sign in again to continue"
        );
    }

    const tokenPayLoad = {
        sub: user.id,
        role: user.role
    }
    const { token } = generateJWTToken(tokenPayLoad);

    return {
        accessToken: token
    }
}