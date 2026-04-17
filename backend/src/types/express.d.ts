declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: "ADMIN" | "MEMBER";
      email: string;
    };
  }
}
