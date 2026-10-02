import bcrypt from "bcrypt";
import { APIError } from "../error/APIError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { USER_ROLES } from "../constants/user.constants.js";
import * as userRepository from "../repositories/user.repository.js";

export async function registerPatient(email: string, password: string) {

    const existingUser = await userRepository.getUser(email);
    if (existingUser) {
        throw new APIError(STATUS_CODES.CONFLICT, "User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.createUser(email, passwordHash, USER_ROLES.PATIENT);

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
        throw new APIError(STATUS_CODES.CONFLICT, "User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.createUser(email, passwordHash, USER_ROLES.DOCTOR);

    return user;
}