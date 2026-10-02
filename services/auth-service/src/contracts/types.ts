import type { Request as ExpressRequest } from "express";
import type { PatientRegisterBody } from "./authSchema.js";

type AppRequest<
    TQuery = undefined,
    TBody = undefined,
    TParams = undefined,
> = {
    query: Readonly<TQuery>;
    body: Readonly<TBody>;
    params: Readonly<TParams>;
    raw: Readonly<ExpressRequest>;
};


export type PatientRegisterRequest = AppRequest<
    undefined,
    PatientRegisterBody,
    undefined
>;