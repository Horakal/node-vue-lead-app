import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/userModel";
require("@dotenvx/dotenvx").config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "3600";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email: email });
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Senha incorreta" });
  if (!JWT_SECRET) return res.status(500).json({ message: "Erro no servidor" });

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email, name: user.username },
    JWT_SECRET,
    {
      expiresIn: parseInt(JWT_EXPIRATION, 10),
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 36000,
  });
  res.status(200).json({ message: "Login bem-sucedido", token });
};
