import express from "express";
import {
    connectRabbitMQ,
    initRabbitMQ
} from "./loaders/queueLoader.js";

const app = express();
import {
    expressLoader,
    // connectDatabase
} from "./loaders/init.js";

async function Loader() {
    // await connectDatabase();
    await connectRabbitMQ();
    await initRabbitMQ();
    expressLoader(app);
}

export {
    Loader,
    app
}