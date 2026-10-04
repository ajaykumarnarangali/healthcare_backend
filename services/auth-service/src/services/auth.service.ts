import bcrypt from "bcrypt";
import crypto from "crypto";
import { APIError } from "../error/APIError.js";
import { retry } from "../utils/retry.js";
import { generateJWTToken } from "../utils/token.utils.js";
import * as userRepository from "../repositories/user.repository.js";
import { getRabbitMQChannel, getRedisClient } from "../loaders/init.js";
import { logger } from "../utils/logger.js";
import {
    USER_ROLES,
    REDIS_KEYS,
    STATUS_CODES,
    RABBITMQ_EXCHANGE,
    USER_EMAIL_VERIFICATION_REQUESTED,
} from "../constants/index.js";
import {
    hashVerificationToken,
    generateVerificationToken
} from "../utils/token.utils.js";


export async function registerPatient(email: string, password: string) {
    logger.info({ email }, "Patient registration started");

    const existingUser = await userRepository.getUser(email);

    if (existingUser) {
        logger.warn({ email }, "Patient registration rejected: email already exists");

        throw new APIError(
            STATUS_CODES.CONFLICT,
            "User with this email already exists"
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

export function verifyLicenseNumber(licenseNumber: string): boolean {
    const MOCK_LICENSE_NUMBERS = [
        "LIC1234567",
        "LIC2345678",
        "LIC3456789",
        "LIC4567890",
        "LIC5678901",
        "LIC6789012",
        "LIC7890123",
        "LIC8901234",
        "LIC9012345",
        "LIC0123456",
    ];
    return MOCK_LICENSE_NUMBERS.includes(licenseNumber);
}

export async function registerDoctor(email: string, password: string) {

    const existingUser = await userRepository.getUser(email);

    if (existingUser) {
        logger.warn({ email }, "Patient registration rejected: email already exists");

        throw new APIError(
            STATUS_CODES.CONFLICT,
            "User with this email already exists"
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

export async function verifyEmail(userId: string, token: string) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
        throw new APIError(
            STATUS_CODES.NOT_FOUND,
            "User not found"
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
        "$2b$12$PASTE_THE_GENERATED_HASH_HERE";

    const user = await userRepository.getUser(email);

    const passwordHash = user?.password_hash ?? DUMMY_PASSWORD_HASH;

    const isPasswordValid = await bcrypt.compare(
        password,
        passwordHash
    );

    if (!user || !isPasswordValid || !user.email_verified) {
        throw new APIError(
            STATUS_CODES.UNAUTHORIZED,
            "Invalid email or password"
        );
    }

    const tokenPayLoad = {
        sub: user.id,
        role: user.role
    }

    const accessToken = generateJWTToken(tokenPayLoad);
    const refreshToken = generateJWTToken(tokenPayLoad, "refresh");

    return {
        role: user,
        accessToken,
        refreshToken
    }
}