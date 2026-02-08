import express from "express";
import { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

const api: Express = express();

api.use(helmet());
api.use(cors());
api.use(morgan("tiny"));
api.use(express.json());

export default api;
