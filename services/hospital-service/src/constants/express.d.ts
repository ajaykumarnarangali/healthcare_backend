import { type UserRole } from "../constants/user.constants.ts";

declare global {
    namespace Express {
        interface User {
            userId: string;
            role: UserRole;
        }

        interface Request {
            user?: User;
        }
    }
}

export { };