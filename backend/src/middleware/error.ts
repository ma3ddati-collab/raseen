import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function notFound(_req: Request, res: Response) {
  return res.status(404).json({
    code: "ROUTE_NOT_FOUND",
    message: "Route not found",
  });
}

type AppError = {
  status?: number;
  code?: string;
  message?: string;
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      code: "VALIDATION_FAILED",
      message: "Validation failed",
      issues: err.issues,
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(503).json({
      code: "DATABASE_UNAVAILABLE",
      message: "Database is unavailable",
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        code: "RESOURCE_CONFLICT",
        message: "Resource already exists",
      });
    }

    return res.status(400).json({
      code: "DATABASE_REQUEST_FAILED",
      message: "Database request failed",
    });
  }

  if (err && typeof err === "object") {
    const appError = err as AppError;
    const statusCode = appError.status ?? 500;
    const code = appError.code ?? "INTERNAL_SERVER_ERROR";
    const message = appError.message ?? "Internal server error";

    return res.status(statusCode).json({ code, message });
  }

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}
