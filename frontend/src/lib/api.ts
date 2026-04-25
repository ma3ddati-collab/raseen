const BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

function token() {
  return localStorage.getItem("token") ?? "";
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? res.statusText);
  return data as T;
}

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { ...authHeaders(), ...init?.headers },
    ...init,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? res.statusText);
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthPayload {
  token: string;
  user: { id: string; companyName: string; email: string; role: string };
}

export const api = {
  auth: {
    register: (body: { email: string; password: string; companyName: string }) =>
      request<AuthPayload>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request<AuthPayload>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  },

  kyc: {
    submit: (body: { legalName: string; nationalId: string; documentUrl: string }) =>
      authRequest<KycProfile>("/kyc/submit", { method: "POST", body: JSON.stringify(body) }),
    me: () => authRequest<KycProfile | null>("/kyc/me"),
  },

  listings: {
    list: () => authRequest<Listing[]>("/listings"),
    create: (body: { title: string; category: string; description: string; price: number; currency?: string }) =>
      authRequest<Listing>("/listings", { method: "POST", body: JSON.stringify(body) }),
  },

  rfq: {
    list: () => authRequest<Rfq[]>("/rfq"),
    create: (body: { title: string; requirements: string; budget: number; currency?: string }) =>
      authRequest<Rfq>("/rfq", { method: "POST", body: JSON.stringify(body) }),
    respond: (id: string, body: { message: string; offerPrice: number }) =>
      authRequest<RfqResponse>(`/rfq/${id}/respond`, { method: "POST", body: JSON.stringify(body) }),
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface KycProfile {
  id: string;
  userId: string;
  legalName: string;
  nationalId: string;
  documentUrl: string;
  status: "PENDING" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  reviewNotes?: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface RfqResponse {
  id: string;
  rfqId: string;
  responderId: string;
  message: string;
  offerPrice: number;
  createdAt: string;
}

export interface Rfq {
  id: string;
  requesterId: string;
  title: string;
  requirements: string;
  budget: number;
  currency: string;
  status: string;
  createdAt: string;
  responses?: RfqResponse[];
}
