import { initContract } from "@ts-rest/core";
import * as userSchema from "./schema.js";

const c = initContract();
const BASIC_ENDPOINT = "/api/user" as const;

export const userContract = c.router({
    createUserProfile: {
        method: 'POST',
        path: `${BASIC_ENDPOINT}/profile`,
        body: userSchema.createPatientProfileSchema,
        responses: {
            201: userSchema.createProfileResponseSchema
        }
    },

    getUserProfile: {
        method: 'GET',
        path: `${BASIC_ENDPOINT}/profile`,
        responses: {
            201: userSchema.getProfileResponseSchema
        }
    }

})