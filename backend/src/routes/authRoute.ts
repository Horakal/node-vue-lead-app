import e from "express";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { authenticateToken } from "../middlewares/authToken";
const authController = require("../controllers/authController");
const router = express.Router();

// Apply stricter rate limiting on auth endpoints to mitigate brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error:
      "Too many authentication attempts from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/api/auth/login", authLimiter, authController.login);

router.post("/api/auth/register", authLimiter, authController.register);

router.get(
  "/api/protected",
  authenticateToken,
  (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(403).json({ message: "Usuário não autenticado" });
    }
    res.json({ message: "Acesso concedido!", user: req.user });
  }
);
export { router as authRoute };
