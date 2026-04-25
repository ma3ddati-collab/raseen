/**
 * E2E test — covers all beta-validation checkpoints
 * Run: INVITE_CODE=ABC123 node e2e-test.mjs
 */

const BASE = "http://127.0.0.1:4000";
const EMAIL_A = `e2e_a_${Date.now()}@test.com`;
const EMAIL_B = `e2e_b_${Date.now()}@test.com`;
const PASS = "E2ePass99";
const ADMIN_EMAIL = "admin@test.com";
const ADMIN_PASS = "12345678";

let tokenA = "";
let tokenAdmin = "";
const results = [];

function pass(step) {
  results.push({ step, status: "PASS" });
  console.log(`  ✓  PASS  ${step}`);
}
function fail(step, err) {
  results.push({ step, status: "FAIL", error: err });
  console.error(`  ✗  FAIL  ${step}`);
  console.error(`           ${err}`);
}

async function req(path, init = {}, token = "") {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { headers, ...init });
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status} — ${JSON.stringify(data)}`);
  return data;
}

// ── 0. Regression: invalid register payload → 400, server stays up ──────────
try {
  await req("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email: "bad", password: "123", companyName: "A" }),
  });
  fail("Regression validation (invalid register → 400)", "expected 400 but got 2xx");
} catch (e) {
  if (e.message.includes("400")) {
    const health = await fetch(`${BASE}/health`);
    if (!health.ok) throw new Error(`health check failed (${health.status})`);
    pass("Regression validation (invalid register → 400, server alive)");
  } else {
    fail("Regression validation (invalid register → 400)", e.message);
  }
}

// ── 1. No invite → Register success ──────────────────────────────────────────
try {
  const data = await req("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email: EMAIL_A, password: PASS, companyName: "Alpha Co" }),
  });
  if (!data.token) throw new Error("no token");
  tokenA = data.token;
  pass("No invite → Register success");
} catch (e) { fail("No invite → Register success", e.message); process.exit(1); }

// ── 2. Login ──────────────────────────────────────────────────────────────────
try {
  const data = await req("/auth/login", { method: "POST", body: JSON.stringify({ email: EMAIL_A, password: PASS }) });
  tokenA = data.token;
  pass("Login");
} catch (e) { fail("Login", e.message); }

// ── 3. KYC Submit ─────────────────────────────────────────────────────────────
let kycId = "";
try {
  const data = await req("/kyc/submit", {
    method: "POST",
    body: JSON.stringify({ legalName: "Alpha Legal", nationalId: "9876543210", documentUrl: "https://example.com/doc.pdf" }),
  }, tokenA);
  kycId = data.id;
  if (data.status !== "SUBMITTED") throw new Error(`status=${data.status}`);
  pass("KYC Submit");
} catch (e) { fail("KYC Submit", e.message); }

// ── 4. Admin login ────────────────────────────────────────────────────────────
try {
  const data = await req("/auth/login", { method: "POST", body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }) });
  tokenAdmin = data.token;
  pass("Admin Login");
} catch (e) { fail("Admin Login", e.message); process.exit(1); }

// ── 5. GET /kyc/pending — admin sees submitted KYC ───────────────────────────
try {
  const data = await req("/kyc/pending", {}, tokenAdmin);
  if (!Array.isArray(data)) throw new Error("not an array");
  const found = data.find(p => p.id === kycId);
  if (!found) throw new Error(`KYC ${kycId} not in pending list`);
  pass("GET /kyc/pending (admin sees submitted KYC)");
} catch (e) { fail("GET /kyc/pending", e.message); }

// ── 6. PATCH /kyc/:id/approve ────────────────────────────────────────────────
try {
  const data = await req(`/kyc/${kycId}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ reviewNotes: "Beta approved" }),
  }, tokenAdmin);
  if (data.status !== "APPROVED") throw new Error(`status=${data.status}`);
  pass("PATCH /kyc/:id/approve");
} catch (e) { fail("PATCH /kyc/:id/approve", e.message); }

// ── 7. /kyc/me reflects APPROVED ─────────────────────────────────────────────
try {
  const data = await req("/kyc/me", {}, tokenA);
  if (data.status !== "APPROVED") throw new Error(`status=${data.status}`);
  pass("KYC /me → APPROVED");
} catch (e) { fail("KYC /me → APPROVED", e.message); }

// ── 8. Listing + RFQ ─────────────────────────────────────────────────────────
try {
  const l = await req("/listings", {
    method: "POST",
    body: JSON.stringify({ title: "Excavator", category: "Heavy Equipment", description: "Ready to rent excavator", price: 7500 }),
  }, tokenA);
  if (!l.id) throw new Error("no id");
  pass("Listing Create");
} catch (e) { fail("Listing Create", e.message); }

try {
  const r = await req("/rfq", {
    method: "POST",
    body: JSON.stringify({ title: "Need Crane", requirements: "50-ton crane 2 months", budget: 40000 }),
  }, tokenA);
  if (r.status !== "OPEN") throw new Error(`status=${r.status}`);
  pass("RFQ Create");
} catch (e) { fail("RFQ Create", e.message); }

// ── 9. Logout — invalid token rejected ──────────────────────────────────────
try {
  await req("/kyc/me", {}, "badtoken");
  fail("Logout (bad token rejected)", "expected 401");
} catch (e) {
  if (e.message.includes("401")) pass("Logout (bad token correctly rejected)");
  else fail("Logout (bad token rejected)", e.message);
}

// Summary
console.log("\n══════════════════════════════════════");
const passed = results.filter(r => r.status === "PASS").length;
const failed = results.filter(r => r.status === "FAIL").length;
console.log(`  Total: ${results.length}  |  PASS: ${passed}  |  FAIL: ${failed}`);
console.log("══════════════════════════════════════");
if (failed > 0) process.exit(1);

