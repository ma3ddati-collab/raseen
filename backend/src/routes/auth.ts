import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { signToken } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";

export const authRouter = Router();

const registerSchema = z.object({
  companyName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  inviteCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }
  const body = parsed.data;

  const allowed = env.INVITE_CODES.split(",").map(c => c.trim()).filter(Boolean);
  if (allowed.length === 0 || !body.inviteCode || !allowed.includes(body.inviteCode)) {
    return res.status(403).json({ message: "Invite only" });
  }

  const exists = await prisma.user.findUnique({ where: { email: body.email } });
  if (exists) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await prisma.user.create({
    data: {
      companyName: body.companyName,
      email: body.email,
      passwordHash,
    },
  });

  await prisma.auditLog.create({
    data: { actorId: user.id, action: "AUTH_REGISTER", entity: "User", entityId: user.id },
  });

  const token = signToken({ sub: user.id, role: user.role, email: user.email });

  return res.status(201).json({
    token,
    user: { id: user.id, companyName: user.companyName, email: user.email, role: user.role },
  });
});

authRouter.post("/login", async (req, res) => {
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
});
