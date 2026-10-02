import { vi } from "vitest";
import * as userRepository from "../../src/repositories/user.repository.js";

export const mockUserAlreadyExist = (email: string) => {
    vi.spyOn(userRepository, "getUser")
        .mockResolvedValue({
            id: "existing-user-id",
            email,
        });
};

export const mockUserRegistrationSuccess = (email: string) => {
    vi.spyOn(userRepository, "getUser")
        .mockResolvedValue(undefined);

    vi.spyOn(userRepository, "createUser")
        .mockResolvedValue({
            id: "new-user-id",
            email,
        });
};