export const REQ_BODY = {
    userExist: {
        email: "existing@gmail.com",
        password: "Existing@123",
    },

    invalidEmail: {
        email: "invalid-email",
        password: "Test@12345",
    },

    invalidPassword: {
        email: "patient@gmail.com",
        password: "test",
    },

    extraField: {
        email: "patient@gmail.com",
        password: "Test@12345",
        username: "Ajay",
    },

    validPayload: {
        email: "newpatient@gmail.com",
        password: "Test@12345",
    },
};

export const RESPONSES = {
    userExist: {
        status: 409,
        success: false,
        message: "User with this email already exists",
    },

    invalidEmail: {
        status: 400,
        success: false,
    },

    invalidPassword: {
        status: 400,
        success: false,
    },

    extraField: {
        status: 400,
        success: false,
    },

    validPayload: {
        status: 201,
        success: true,
        message: "Patient registered successfully",
    },
};

export const TEST_NAME = "Patient Registration API";

export const TEST_CASES = {
    TEST_1:
        "TEST_CASE_1 (Negative) -------> It should return error if email already exists",

    TEST_2:
        "TEST_CASE_2 (Negative) -------> It should return error when email is invalid",

    TEST_3:
        "TEST_CASE_3 (Negative) -------> It should return error when password validation fails",

    TEST_4:
        "TEST_CASE_4 (Negative) -------> It should return error when request contains an extra field",

    TEST_5:
        "TEST_CASE_5 (Positive) -------> It should register patient successfully",
};