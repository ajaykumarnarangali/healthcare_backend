import type { Request as ExpressRequest } from "express";
import type { createPatientProfileBody } from "../user/schema.js";

type AuthenticatedUser = {
    userId: string;
    role: string;
};

type AppRequest<
    TQuery = undefined,
    TBody = undefined,
    TParams = undefined,
    TFile = undefined,
> = {
    query: Readonly<TQuery>;
    body: Readonly<TBody>;
    params: Readonly<TParams>;
    user?: Readonly<AuthenticatedUser>;
    file?: TFile;
    raw: Readonly<ExpressRequest>;
};

export type createProfileRequest = AppRequest<
    undefined,
    createPatientProfileBody,
    undefined,
    Express.Multer.File
>;