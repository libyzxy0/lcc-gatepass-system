import express, { Application } from "express";
import Bootstrap from "@/bootstrap";
import errorHandler from "@/middlewares/error-handler";
import notFound from "@/middlewares/not-found";
import { initializeRoutes } from "@/routes";
import { limiter } from "@/middlewares/ratelimit";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();

app.use(errorHandler);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

//app.use(limiter);

Bootstrap(app);
initializeRoutes(app);
app.use(notFound);

