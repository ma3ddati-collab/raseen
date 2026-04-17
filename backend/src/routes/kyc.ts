import { KycStatus } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const kycRouter = Router();

const submitKycSchema = z.object({
  legalName: z.string().min(2),
  nationalId: z.string().min(5),
  documentUrl: z.string().url(),
});

const reviewSchema = z.object({
  status: z.enum([KycStatus.APPROVED, KycStatus.REJECTED]),
  reviewNotes: z.string().min(2),
});

kycRouter.use(requireAuth);

kycRouter.post("/submit", async (req: Request, res: Response) => {
  const parsed = submitKycSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }
  const body = parsed.data;

  const profile = await prisma.kycProfile.upsert({
    where: { userId: req.user!.id },
    update: { ...body, status: KycStatus.SUBMITTED },
    create: { userId: req.user!.id, ...body, status: KycStatus.SUBMITTED },
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user!.id,
      action: "KYC_SUBMIT",
      entity: "KycProfile",
      entityId: profile.id,
    },
  });

  return res.status(201).json(profile);
});

kycRouter.get("/me", async (req: Request, res: Response) => {
  const profile = await prisma.kycProfile.findUnique({ where: { userId: req.user!.id } });
  return res.json(profile);
});

// GET /kyc/pending — list all SUBMITTED/UNDER_REVIEW profiles (admin)
kycRouter.get("/pending", requireAdmin, async (_req: Request, res: Response) => {
  const profiles = await prisma.kycProfile.findMany({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    include: { user: { select: { id: true, companyName: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
  return res.json(profiles);
});

// PATCH /kyc/:id/approve — shorthand approve (admin)
kycRouter.patch("/:id/approve", requireAdmin, async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const profile = await prisma.kycProfile.update({
    where: { id },
    data: {
      status: "APPROVED",
      reviewNotes: req.body.reviewNotes ?? "Approved",
      reviewedById: req.user!.id,
      reviewedAt: new Date(),
    },
  });
  await prisma.auditLog.create({
    data: {
      actorId: req.user!.id,
      action: "KYC_REVIEW",
      entity: "KycProfile",
      entityId: profile.id,
      payload: JSON.stringify({ status: "APPROVED" }),
    },
  });
  return res.json(profile);
});

kycRouter.patch("/:id/review", requireAdmin, async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }
  const body = parsed.data;
  const profile = await prisma.kycProfile.update({
    where: { id },
    data: {
      status: body.status,
      reviewNotes: body.reviewNotes,
      reviewedById: req.user!.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user!.id,
      action: "KYC_REVIEW",
      entity: "KycProfile",
      entityId: profile.id,
      payload: JSON.stringify(body),
    },
  });

  return res.json(profile);
});
