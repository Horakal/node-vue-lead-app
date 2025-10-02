import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import { clientLeadRoute } from "./routes/clientLeadRoute";
import { authRoute } from "./routes/authRoute";
import connectDb from "./tools/db";

require("@dotenvx/dotenvx").config();

const app = express();
app.use(express.json());
// If running behind a proxy (e.g., Render, Heroku) enable trust proxy so rate limiter
// and other middlewares can read the real client IP from X-Forwarded-For
app.set("trust proxy", 1);

// Global rate limiter: conservative default to protect basic endpoints
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);
if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: process.env.PROD_CLIENT_URL,
      credentials: true,
    })
  );
} else {
  const allowedOrigins = [
    process.env.LOCAL_CLIENT_URL,
    process.env.PROD_CLIENT_URL,
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
}
app.use(cookieParser());
app.use(clientLeadRoute);
app.use(authRoute);
connectDb();

export { app };
