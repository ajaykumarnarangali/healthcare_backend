import { initContract } from "@ts-rest/core";
import * as authSchema from "./authSchema.js";

const c = initContract();
const BASIC_ENDPOINT = "/api/auth" as const;

export const authContract = c.router({
    patientRegister: {
        method: "POST",
        path: `${BASIC_ENDPOINT}/patient/register`,
        body: authSchema.patientRegisterBodySchema,
        responses: {
            201: authSchema.RegisterResponseSchema,
        },
    },

    doctorRegister: {
        method: 'POST',
        path: `${BASIC_ENDPOINT}/doctor/register`,
        body: authSchema.doctorRegisterBodySchema,
        responses: {
            201: authSchema.RegisterResponseSchema,
        },
    },

    verifyEmail: {
        method: "POST",
        path: `${BASIC_ENDPOINT}/verify`,
        query: authSchema.verifyEmailSchema,
        body: c.type<undefined>(),
        responses: {
            200: authSchema.verifyEmailResponseSchema,
        },
    },

    // login: {
    //     method: "POST",
    //     path: `${BASIC_ENDPOINT}/login`,

    //     body: authSchema.loginBodySchema,

    //     responses: {
    //         200: authSchema.loginResponseSchema
    //     },
    // },
});