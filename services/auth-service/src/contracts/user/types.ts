import type { Request as ExpressRequest } from "express";
import type {
    PatientRegisterBody,
    DoctorRegisterBody,
    verifyEmailQuery,
    vefifyEmailBody,
    UserLoginBody
} from "./schema.js";

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
    vefifyEmailBody,
    undefined
>;

export type UserLoginRequest = AppRequest<
    undefined,
    UserLoginBody,
    undefined
>;

export type RefreshRequest = AppRequest<
    undefined,
    undefined,
    undefined
>;

export type getMeRequest = AppRequest<
    undefined,
    undefined,
    undefined
>;