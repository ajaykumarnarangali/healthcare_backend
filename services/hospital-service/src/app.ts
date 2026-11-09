import express from "express";
import {
  expressLoader,
  connectDatabase,
  connectRabbitMQ,
  connectRedis
} from "./loaders/init.js";

const app = express();

async function Loader() {
  await connectDatabase();
  await connectRabbitMQ();
  await connectRedis();
  expressLoader(app);
}

export {
  Loader,
  app
}