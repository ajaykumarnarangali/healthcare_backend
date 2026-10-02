import cors from "cors";
import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import {
    bodyParserHandler,
    fourOhFourHandler,
    globalErrorHandler
} from "../error/errorHandler.js";
// import { routerLoader } from "./routesLoader.js";

export function expressLoader(app: Express) {
    app.use(cors({
        origin: process.env.FRONT_END_URL,
        credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(bodyParserHandler);

    // routerLoader(app);

    app.use(fourOhFourHandler);
    app.use(globalErrorHandler);
}