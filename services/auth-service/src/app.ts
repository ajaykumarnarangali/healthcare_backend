import express from "express";
const app = express();
import { expressLoader } from "./loaders/expressLoader.js";

function Loader() {
    expressLoader(app);
}

export {
    Loader,
    app
}