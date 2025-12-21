import express, { Application } from "express";
import Bootstrap from "@/bootstrap";
import errorHandler from "@/middlewares/error-handler";
import notFound from "@/middlewares/not-found";
import { initializeRoutes } from "@/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import '@/mqtt/esp';

/*
* Comment for now, tanginang CloudFlare Turnstile
*/
/* import { limiter } from "@/middlewares/ratelimit"; */

const app: Application = express();

app.use(errorHandler);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const allowedOrigins = [
  "https://admin.lccgatepass.xyz",
  "https://lccgatepass.xyz",
  "https://www.lccgatepass.xyz",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/*
* Comment for now, tanginang CloudFlare Turnstile
*/
/* app.use(limiter); */

Bootstrap(app);
initializeRoutes(app);
app.use(notFound);