import type { Request as ExpressRequest } from "express";
import type {
    PatientRegisterBody,
    DoctorRegisterBody,
    verifyEmailQuery,
    UserLoginBody
} from "./authSchema.js";

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

export type DoctorRegisterRequest = AppRequest<
    undefined,
    DoctorRegisterBody,
    undefined
>;

export type VerifyEmailRequest = AppRequest<
    verifyEmailQuery,
    undefined,
    undefined
>;

export type UserLoginRequest = AppRequest<
    undefined,
    UserLoginBody,
    undefined
>;