import { APIError } from "./APIError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import type { Request, Response, NextFunction } from "express";

function bodyParserHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if ((err instanceof SyntaxError) || (err instanceof TypeError)) {
        return next(new APIError(STATUS_CODES.BAD_REQUEST, "Malformed JSON."));
    }
    next();
}

function fourOhFourHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    return next(new APIError(STATUS_CODES.NOT_FOUND, `${req.path} is not valid path to a resource.`));
}

function fourOhFiveHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    return next(new APIError(STATUS_CODES.METHOD_NOT_ALLOWED, `${req.method} method is not supported at ${req.path}.`));
}

function globalErrorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let error: APIError;

    if (err instanceof APIError) {
        error = err;
    } else {
        error = new APIError(
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            "Internal server error"
        );
    }

    return res
        .status(error.status)
        .json({
            success: false,
            message: error.message
        });
}


export {
    bodyParserHandler,
    fourOhFourHandler,
    fourOhFiveHandler,
    globalErrorHandler
}