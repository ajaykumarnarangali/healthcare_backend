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

    updateUserProfile: {
        method: 'PATCH',
        path: `${BASIC_ENDPOINT}/profile`,
        body: userSchema.updatePatientProfileSchema,
        responses: {
            201: userSchema.createProfileResponseSchema
        }
    },

    getUserProfile: {
        method: 'GET',
        path: `${BASIC_ENDPOINT}/profile`,
        responses: {
            200: userSchema.getProfileResponseSchema
        }
    },

    getUsersByQuery: {
        method: 'GET',
        path: `${BASIC_ENDPOINT}/`,
        query: userSchema.getUsersQuerySchema,
        responses: {
            200: userSchema.getUsersResponseSchema
        }
    },

    inviteHospitalAdmin: {
        method: 'POST',
        path: `${BASIC_ENDPOINT}/invitations/hospital-admin`,
        body: userSchema.adminInviteSchema,
        responses: {
            201: userSchema.inviteResponseSchema
        }
    },

    acceptInvitation: {
        method: 'POST',
        path: `${BASIC_ENDPOINT}/invitations/accept`,
        query: userSchema.acceptInvitationQuerySchema,
        body: userSchema.acceptInvitationSchema,
        responses: {
            201: userSchema.acceptInvitationResponseSchema
        }
    }
})