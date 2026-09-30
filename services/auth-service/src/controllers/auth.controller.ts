import { APIError } from "../error/APIError.js";


export async function registerPatient(req: any) {
    throw new APIError(404, "not found");
    return {
        status: 201 as const,
        body: {
            success: true,
            message: "Patient registered successfully",
        },
    };
}