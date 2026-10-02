import express from "express";
const app = express();
import {
    expressLoader,
    // connectDatabase
} from "./loaders/init.js";

async function Loader() {
    // await connectDatabase();
    expressLoader(app);
}

export {
    Loader,
    app
}