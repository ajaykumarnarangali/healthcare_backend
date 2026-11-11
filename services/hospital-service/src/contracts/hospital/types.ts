import type { Request as ExpressRequest } from "express";
import type {
    HospitalCreationBody,
    HospitalUpdaionBody,
    UpdateHospitalPathParam
} from "../hospital/schema.js";

type AuthenticatedUser = {
    userId: string;
    role: string;
};

type AppRequest<
    TQuery = undefined,
    TBody = undefined,
    TParams = undefined,
    TFile = undefined
> = {
    query: Readonly<TQuery>;
    body: Readonly<TBody>;
    params: Readonly<TParams>;
    user?: Readonly<AuthenticatedUser>;
    file?: TFile;
    raw: Readonly<ExpressRequest>;
};


export type HospitalCreationReq = AppRequest<
    undefined,
    HospitalCreationBody,
    undefined,
    Express.Multer.File
>;

export type HospitalUpdationReq = AppRequest<
    undefined,
    HospitalUpdaionBody,
    UpdateHospitalPathParam,
    Express.Multer.File
>;

export type emptyRequest = AppRequest<
    undefined,
    undefined,
    undefined
>;
