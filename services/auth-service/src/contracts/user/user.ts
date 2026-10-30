import { initContract } from "@ts-rest/core";
import * as userSchema from "./schema.js";

const c = initContract();
const BASIC_ENDPOINT = "/api/user" as const;

export const userContract = c.router({
    createPatientProfile: {
        method: 'POST',
        path: `${BASIC_ENDPOINT}/profile`,
        body: userSchema.createPatientProfileSchema,
        responses: {
            201: userSchema.createProfileResponseSchema
        }
    },
})