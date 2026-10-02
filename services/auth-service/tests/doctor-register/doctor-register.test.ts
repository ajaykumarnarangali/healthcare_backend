import { beforeEach, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";

import { expressLoader } from "../../src/loaders/init.js";
import { app } from "../../src/app.js";

import {
    mockUserAlreadyExist,
    mockUserRegistrationSuccess,
} from "./doctor-register.mock.js";

import {
    TEST_NAME,
    TEST_CASES,
    REQ_BODY,
    RESPONSES,
} from "./doctor-register.data.js";

describe(TEST_NAME, () => {
    beforeAll(() => {
        expressLoader(app);
    });

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it(TEST_CASES.TEST_1, async () => {
        mockUserAlreadyExist(REQ_BODY.userExist.email);

        const res = await request(app)
            .post("/api/auth/doctor/register")
            .send(REQ_BODY.userExist);

        expect(res.status).toBe(RESPONSES.userExist.status);
        expect(res.body.success).toBe(RESPONSES.userExist.success);
        expect(res.body.message).toBe(RESPONSES.userExist.message);
    });

    it(TEST_CASES.TEST_2, async () => {
        const res = await request(app)
            .post("/api/auth/doctor/register")
            .send(REQ_BODY.invalidEmail);

        expect(res.status).toBe(RESPONSES.invalidEmail.status);
        expect(res.body.success).toBe(RESPONSES.invalidEmail.success);
    });

    it(TEST_CASES.TEST_3, async () => {
        const res = await request(app)
            .post("/api/auth/doctor/register")
            .send(REQ_BODY.invalidPassword);

        expect(res.status).toBe(RESPONSES.invalidPassword.status);
        expect(res.body.success).toBe(RESPONSES.invalidPassword.success);
    });

    it(TEST_CASES.TEST_4, async () => {
        const res = await request(app)
            .post("/api/auth/doctor/register")
            .send(REQ_BODY.extraField);

        expect(res.status).toBe(RESPONSES.extraField.status);
        expect(res.body.success).toBe(RESPONSES.extraField.success);
    });

    it(TEST_CASES.TEST_5, async () => {
        const res = await request(app)
            .post("/api/auth/doctor/register")
            .send(REQ_BODY.licenseNotVerified);

        expect(res.status).toBe(RESPONSES.licenseNotVerified.status);
        expect(res.body.success).toBe(RESPONSES.licenseNotVerified.success);
        expect(res.body.message).toBe(
            RESPONSES.licenseNotVerified.message
        );
    });

    it(TEST_CASES.TEST_6, async () => {
        mockUserRegistrationSuccess(REQ_BODY.validPayload.email);

        const res = await request(app)
            .post("/api/auth/doctor/register")
            .send(REQ_BODY.validPayload);

        expect(res.status).toBe(RESPONSES.validPayload.status);
        expect(res.body.success).toBe(RESPONSES.validPayload.success);
        expect(res.body.message).toBe(RESPONSES.validPayload.message);
    });
});