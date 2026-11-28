import express from "express";
import {
  expressLoader,
  connectDatabase,
  connectRedis
} from "./loaders/init.js";

const app = express();

async function Loader() {
  await connectDatabase();
  // await connectRedis();
  expressLoader(app);
}

export {
  Loader,
  app
}