import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

import sequelize from "./db";
import "./models/models";
import cors from "cors";
import router from "./routes/index";

const app: Express = express();
const port = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", router);

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
};

start();
