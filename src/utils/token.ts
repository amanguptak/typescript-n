import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../secrets";
import { CookieOptions, Request, Response } from "express";
import { User } from "@prisma/client";

interface sendTokenParams {
  req: Request;
  res: Response;
  user: User;
  statusCode: number;
}

function generateToken(user: User) {
  const payload = { id: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

export function sendToken({ req, res, user, statusCode }: sendTokenParams) {
  const token = generateToken(user);
  const payload = { id: user.id, email: user.email, name: user.name };
  const options: CookieOptions = {
    expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
  };

  res.cookie("authToken", token, options).status(statusCode).json({
    success: true,
    payload,
  });
}
