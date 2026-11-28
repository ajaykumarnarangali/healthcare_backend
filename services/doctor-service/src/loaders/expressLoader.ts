import cors from "cors";
import express from "express";
import helmet from "helmet";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import {
    bodyParserHandler,
    fourOhFourHandler,
    globalErrorHandler
} from "../error/errorHandler.js";
import { routerLoader } from "./routesLoader.js";

export function expressLoader(app: Express) {
    const allowedOrigins = [
        process.env.USER_FRONTEND_URL,
        process.env.ADMIN_FRONTEND_URL,
    ].filter((origin): origin is string => Boolean(origin));

    app.use(helmet());
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(bodyParserHandler);

    routerLoader(app);

    app.use(fourOhFourHandler);
    app.use(globalErrorHandler);
}