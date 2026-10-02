export const REQ_BODY = {
    userExist: {
        licenseNumber: "LIC1234567",
        email: "existingdoctor@gmail.com",
        password: "Doctor@123",
    },

    invalidEmail: {
        licenseNumber: "LIC1234567",
        email: "invalid-email",
        password: "Doctor@123",
    },

    invalidPassword: {
        licenseNumber: "LIC1234567",
        email: "doctor@gmail.com",
        password: "test",
    },

    extraField: {
        licenseNumber: "LIC1234567",
        email: "doctor@gmail.com",
        password: "Doctor@123",
        username: "Ajay",
    },

    licenseNotVerified: {
        licenseNumber: "INVALID123",
        email: "doctor@gmail.com",
        password: "Doctor@123",
    },

    validPayload: {
        licenseNumber: "LIC1234567",
        email: "newdoctor@gmail.com",
        password: "Doctor@123",
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

    licenseNotVerified: {
        status: 400,
        success: false,
        message: "Invalid license number"
    },

    validPayload: {
        status: 201,
        success: true,
        message: "Doctor registered successfully",
    },
};

export const TEST_NAME = "Doctor Registration API";

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
        "TEST_CASE_5 (Negative) -------> It should return error when license number is not verified",

    TEST_6:
        "TEST_CASE_6 (Positive) -------> It should register doctor successfully",
};