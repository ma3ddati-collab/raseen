import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const metricsRouter = Router();

metricsRouter.use(requireAuth, requireAdmin);

metricsRouter.get("/overview", async (_req, res) => {
  const [users, kycSubmitted, listings, rfqs] = await Promise.all([
    prisma.user.count(),
    prisma.kycProfile.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "APPROVED"] } } }),
    prisma.listing.count(),
    prisma.rfq.count(),
  ]);

  const recentAudit = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return res.json({
    totals: { users, kycSubmitted, listings, rfqs },
    recentAudit,
  });
});
