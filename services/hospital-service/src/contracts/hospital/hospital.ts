import { initContract } from "@ts-rest/core";
import * as hospitalSchema from "./schema.js";

const c = initContract();
const BASIC_ENDPOINT = "/api/hospitals" as const;


export const hospitalContract = c.router({
    createHospital: {
        method: 'POST',
        path: BASIC_ENDPOINT,
        body: hospitalSchema.createHospitalSchema,
        responses: {
            201: hospitalSchema.createHospitalResponse
        }
    },
    updateHospital: {
        method: 'PATCH',
        path: `${BASIC_ENDPOINT}/:hospitalId`,
        pathParams: hospitalSchema.updateHospitalPathParam,
        body: hospitalSchema.updateHospitalSchema,
        responses: {
            200: hospitalSchema.updateHospitalResponse
        }
    }
});