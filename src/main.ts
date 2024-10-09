require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import routes from "./app/routes/routes";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({ status: "API is running on /api" });
});

app.use(routes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
