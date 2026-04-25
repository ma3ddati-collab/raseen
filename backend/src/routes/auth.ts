import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { signToken } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";
import {
  authLoginRateLimit,
  authRegisterRateLimit,
} from "../middleware/rateLimit.js";

export const authRouter = Router();

const registerSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
});

authRouter.post("/register", authRegisterRateLimit, async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsed.error.flatten(),
      });
    }
    const body = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    let user;
    try {
      user = await prisma.user.create({
        data: {
          companyName: body.companyName,
          email: body.email,
          passwordHash,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return res.status(409).json({ message: "Email already exists" });
      }
      throw err;
    }

    await prisma.auditLog.create({
      data: { actorId: user.id, action: "AUTH_REGISTER", entity: "User", entityId: user.id },
    });

    const token = signToken({ sub: user.id, role: user.role, email: user.email });

    return res.status(201).json({
      token,
      user: { id: user.id, companyName: user.companyName, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return res.status(503).json({
        code: "DATABASE_UNAVAILABLE",
        message: "Database is unavailable",
      });
    }
    return next(err);
  }
});

authRouter.post("/login", authLoginRateLimit, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsed.error.flatten(),
      });
    }
    const body = parsed.data;

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await prisma.auditLog.create({
      data: { actorId: user.id, action: "AUTH_LOGIN", entity: "User", entityId: user.id },
    });

    const token = signToken({ sub: user.id, role: user.role, email: user.email });

    return res.json({
      token,
      user: { id: user.id, companyName: user.companyName, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return res.status(503).json({
        code: "DATABASE_UNAVAILABLE",
        message: "Database is unavailable",
      });
    }
    return next(err);
  }
});
