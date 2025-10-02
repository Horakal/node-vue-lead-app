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
console.log("CORS allowed origins from env:", process.env.PROD_CLIENT_URL);
// Build allowed origins list from env; allow comma-separated values and simple '*' wildcard
const rawAllowed = (
  process.env.PROD_CLIENT_URL ||
  process.env.LOCAL_CLIENT_URL ||
  ""
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function originAllowedFactory(allowedList: string[]) {
  // convert wildcard patterns (like https://*.example.com) into RegExp
  const patterns = allowedList.map((p) => {
    if (p.includes("*")) {
      const re =
        "^" +
        p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*") +
        "$";
      return new RegExp(re);
    }
    return p;
  });
  return (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) return callback(null, true);
    if (allowedList.includes(origin)) return callback(null, true);
    for (const pat of patterns) {
      if (pat instanceof RegExp && pat.test(origin))
        return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  };
}

const allowedOriginsList = rawAllowed;
// use same logic for both production and non-production: if list is empty allow all (dev)
if (!allowedOriginsList || allowedOriginsList.length === 0) {
  // allow any origin (useful for dev); in production prefer to set PROD_CLIENT_URL
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: originAllowedFactory(allowedOriginsList),
      credentials: true,
    })
  );
}
app.use(cookieParser());
app.use(clientLeadRoute);
app.use(authRoute);
connectDb();

export { app };
