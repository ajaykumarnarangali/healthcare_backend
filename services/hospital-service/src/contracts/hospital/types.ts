import type { Request as ExpressRequest } from "express";
import type {
    HospitalCreationBody
} from "../hospital/schema.js";

type AuthenticatedUser = {
    userId: string;
    role: string;
};

type AppRequest<
    TQuery = undefined,
    TBody = undefined,
    TParams = undefined,
> = {
    query: Readonly<TQuery>;
    body: Readonly<TBody>;
    params: Readonly<TParams>;
    user?: Readonly<AuthenticatedUser>;
    raw: Readonly<ExpressRequest>;
};


export type HospitalCreationReq = AppRequest<
    undefined,
    HospitalCreationBody,
    undefined
>;

export type emptyRequest = AppRequest<
    undefined,
    undefined,
    undefined
>;
