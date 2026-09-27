import { initServer } from "@ts-rest/express";
import { authContract } from "../contracts/auth.js";

const s = initServer();

export const authRoutes = s.router(authContract, {
    login: async ({ body }) => {
        console.log("reached controller");

        return {
            status: 200,
            body: {
                success: true,
                message: "Login successful",
                accessToken: "dummy-token",
            },
        };
    },
});