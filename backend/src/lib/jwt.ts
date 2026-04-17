import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type AuthTokenPayload = {
  sub: string;
  role: "ADMIN" | "MEMBER";
  email: string;
};

export function signToken(payload: AuthTokenPayload): string {
  const expiresIn = env.JWT_EXPIRES_IN as SignOptions["expiresIn"];
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
