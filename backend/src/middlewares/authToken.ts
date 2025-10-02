import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, JsonWebTokenError } from "jsonwebtoken";
require("@dotenvx/dotenvx").config();
interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "Acesso negado: Token ausente" });
  if (!JWT_SECRET) return res.status(500).json({ message: "Erro no servidor" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(403).json({ message: "Token inválido" });
  }
};
