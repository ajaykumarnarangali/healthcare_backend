import { APIError } from "../error/APIError.js";
import type { Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes.js";
import * as hospitalService from "../services/hospital.service.js";
import type {
    HospitalCreationReq
} from "../contracts/hospital/types.js";

export async function createHospital(req: HospitalCreationReq) {

    const hospitalData = req.body;
    console.log(hospitalData);

}