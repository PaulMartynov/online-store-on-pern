import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import sequelize from "./db";
import "./models/models";

const app: Express = express();
const port = process.env.SERVER_PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello1");
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
