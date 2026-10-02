import { STATUS_CODES } from "../constants/statusCodes.js";
import { APIError } from "../error/APIError.js";
import bcrypt from "bcrypt";
import * as userRepository from "../repositories/user.repository.js";

export async function registerPatient(email: string, password: string) {

    const existingUser = await userRepository.getUser(email);
    if (existingUser) {
        throw new APIError(STATUS_CODES.CONFLICT, "Patient with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.createUser(email, passwordHash);

    return user;
}