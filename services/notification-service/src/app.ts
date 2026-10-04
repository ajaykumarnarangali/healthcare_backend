import express from "express";
import {
    connectDatabase,
    connectRabbitMQ,
    initRabbitMQ,
    expressLoader
} from "./loaders/init.js";
import { startNotificationConsumer } from "./consumers/notification.consumer.js";

const app = express();


async function Loader() {
    await connectDatabase();
    await connectRabbitMQ();
    await initRabbitMQ();
    startNotificationConsumer();
    expressLoader(app);
}

export {
    Loader,
    app
}