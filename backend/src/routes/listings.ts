import { ListingStatus } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const listingsRouter = Router();

const createSchema = z.object({
  title: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  currency: z.string().min(3).max(3).default("SAR"),
});

const updateStatusSchema = z.object({
  status: z.enum([
    ListingStatus.DRAFT,
    ListingStatus.ACTIVE,
    ListingStatus.PAUSED,
    ListingStatus.SOLD,
    ListingStatus.ARCHIVED,
  ]),
});

listingsRouter.get("/", async (_req: Request, res: Response) => {
  const items = await prisma.listing.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(items);
});

listingsRouter.get("/:id", async (req: Request, res: Response) => {
  const item = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!item) {
    return res.status(404).json({ message: "Listing not found" });
  }
  return res.json(item);
});

listingsRouter.post("/", requireAuth, async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }
  const body = parsed.data;
  const item = await prisma.listing.create({
    data: {
      ownerId: req.user!.id,
      title: body.title,
      category: body.category,
      description: body.description,
      price: body.price,
      currency: body.currency,
      status: ListingStatus.DRAFT,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user!.id,
      action: "LISTING_CREATE",
      entity: "Listing",
      entityId: item.id,
    },
  });

  return res.status(201).json(item);
});

listingsRouter.patch("/:id/status", requireAuth, async (req: Request, res: Response) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.flatten(),
    });
  }
  const body = parsed.data;

  const found = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!found) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (found.ownerId !== req.user!.id && req.user!.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const item = await prisma.listing.update({
    where: { id: req.params.id },
    data: { status: body.status },
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user!.id,
      action: "LISTING_STATUS_UPDATE",
      entity: "Listing",
      entityId: item.id,
      payload: JSON.stringify(body),
    },
  });

  return res.json(item);
});
