import express from "express";
import {
  expressLoader,
  connectDatabase,
  connectRabbitMQ
} from "./loaders/init.js";

const app = express();

async function Loader() {
  await connectDatabase();
  await connectRabbitMQ();
  expressLoader(app);
}

export {
  Loader,
  app
}