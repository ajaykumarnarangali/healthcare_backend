import { initContract } from "@ts-rest/core";
import {
    loginBodySchema,
    loginResponseSchema
} from "./authSchema.js"

const c = initContract();
const BASIC_ENDPOINT = "/api/auth" as const;

export const authContract = c.router({
    login: {
        method: "POST",
        path: `${BASIC_ENDPOINT}/login`,

        body: loginBodySchema,

        responses: {
            200: loginResponseSchema
        },
    },
});