import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cors from "cors";
import dotenv from 'dotenv';
import Router from "./Routers/auth.js";

dotenv.config()
const app = express();

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));