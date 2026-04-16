declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: "ADMIN" | "MEMBER";
      email: string;
    };
  }
}

declare module "express" {
  export type Request = any;
  export type Response = any;
  export type NextFunction = any;
  export const Router: any;
  const express: any;
  export default express;
}

declare module "@prisma/client" {
  export const KycStatus: any;
  export const ListingStatus: any;
  export const UserRole: any;

  export class PrismaClient {
    [key: string]: any;
    $queryRaw: any;
    $disconnect(): Promise<void>;
  }
}
