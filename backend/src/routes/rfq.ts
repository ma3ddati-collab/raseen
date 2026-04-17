import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const rfqRouter = Router();

const createSchema = z.object({
  title: z.string().min(2),
  requirements: z.string().min(10),
  budget: z.number().positive(),
  currency: z.string().min(3).max(3).default("SAR"),
});

const responseSchema = z.object({
  message: z.string().min(10),
  offerPrice: z.number().positive(),
});

rfqRouter.get("/", async (_req, res) => {
  const rows = await prisma.rfq.findMany({ include: { responses: true }, orderBy: { createdAt: "desc" } });
  return res.json(rows);
});

rfqRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }
  const body = parsed.data;
  const rfq = await prisma.rfq.create({
    data: {
      requesterId: req.user!.id,
      title: body.title,
      requirements: body.requirements,
      budget: body.budget,
      currency: body.currency,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user!.id,
      action: "RFQ_CREATE",
      entity: "Rfq",
      entityId: rfq.id,
    },
  });

  return res.status(201).json(rfq);
});

rfqRouter.post("/:id/respond", requireAuth, async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = responseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }
  const body = parsed.data;

  const rfq = await prisma.rfq.findUnique({ where: { id } });
  if (!rfq) {
    return res.status(404).json({ message: "RFQ not found" });
  }

  const response = await prisma.rfqResponse.upsert({
    where: {
      rfqId_responderId: {
        rfqId: rfq.id,
        responderId: req.user!.id,
      },
    },
    update: {
      message: body.message,
      offerPrice: body.offerPrice,
    },
    create: {
      rfqId: rfq.id,
      responderId: req.user!.id,
      message: body.message,
      offerPrice: body.offerPrice,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user!.id,
      action: "RFQ_RESPOND",
      entity: "RfqResponse",
      entityId: response.id,
    },
  });

  return res.status(201).json(response);
});
