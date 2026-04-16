import { useEffect, useState } from "react";
import { api, Rfq } from "../lib/api";
import { card, input, btnPrimary, COLORS } from "../styles/ui";
import { useAuth } from "../context/AuthContext";

export default function RFQ() {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Respond state
  const [respondId, setRespondId] = useState<string | null>(null);
  const [respMsg, setRespMsg] = useState("");
  const [respPrice, setRespPrice] = useState("");
  const [respErr, setRespErr] = useState("");
  const [respLoading, setRespLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setRfqs(await api.rfq.list());
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const rfq = await api.rfq.create({ title, requirements, budget: Number(budget) });
      setRfqs(prev => [{ ...rfq, responses: [] }, ...prev]);
      setShowForm(false);
      setTitle(""); setRequirements(""); setBudget("");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    if (!respondId) return;
    setRespErr("");
    setRespLoading(true);
    try {
      await api.rfq.respond(respondId, { message: respMsg, offerPrice: Number(respPrice) });
      setRespondId(null);
      setRespMsg(""); setRespPrice("");
      await load();
    } catch (e: any) {
      setRespErr(e.message);
    } finally {
      setRespLoading(false);
    }
  }

  const myRfqs = rfqs.filter(r => r.requesterId === user?.id);
  const othersRfqs = rfqs.filter(r => r.requesterId !== user?.id);

  return (
    <div>
      {/* ── Outbox ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>طلباتي (Outbox)</h2>
        <button style={btnPrimary} onClick={() => setShowForm(v => !v)}>
          {showForm ? "إلغاء" : "+ طلب جديد"}
        </button>
      </div>

      {showForm && (
        <div style={{ ...card, padding: 24, marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>إنشاء طلب عروض</h3>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: 12 }}>
            <input style={input} placeholder="عنوان الطلب" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea
              style={{ ...input, height: 90, padding: "10px 14px", resize: "vertical" } as React.CSSProperties}
              placeholder="المتطلبات التفصيلية (10 أحرف على الأقل)"
              value={requirements}
              onChange={e => setRequirements(e.target.value)}
              minLength={10}
              required
            />
            <input style={input} placeholder="الميزانية (ريال)" type="number" min={1} value={budget} onChange={e => setBudget(e.target.value)} required />
            {err && <p style={{ color: "#FF6B6B", margin: 0, fontSize: 14 }}>{err}</p>}
            <button style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
              {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: COLORS.muted }}>جاري التحميل...</p>
      ) : myRfqs.length === 0 ? (
        <div style={{ ...card, padding: 20, color: COLORS.muted, textAlign: "center", marginBottom: 32 }}>
          لا طلبات مُرسَلة بعد.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
          {myRfqs.map(r => (
            <div key={r.id} style={{ ...card, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div style={{ color: "#00FFCC", fontWeight: 700 }}>{r.budget.toLocaleString()} {r.currency}</div>
              </div>
              <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 6 }}>{r.requirements}</div>
              {r.responses && r.responses.length > 0 && (
                <div style={{ marginTop: 12, borderTop: `1px solid ${COLORS.border}`, paddingTop: 12 }}>
                  <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>الردود ({r.responses.length}):</div>
                  {r.responses.map(resp => (
                    <div key={resp.id} style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>
                      · {resp.message} — <span style={{ color: "#F5A623" }}>{resp.offerPrice.toLocaleString()} ر.س</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Inbox ── */}
      <h2 style={{ margin: "0 0 16px" }}>طلبات السوق (Inbox)</h2>

      {othersRfqs.length === 0 ? (
        <div style={{ ...card, padding: 20, color: COLORS.muted, textAlign: "center" }}>
          لا طلبات في السوق حالياً.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {othersRfqs.map(r => (
            <div key={r.id} style={{ ...card, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.title}</div>
                  <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>{r.requirements}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginRight: 12 }}>
                  <div style={{ color: "#00FFCC", fontWeight: 700 }}>{r.budget.toLocaleString()} {r.currency}</div>
                  <button
                    style={{ marginTop: 8, padding: "6px 14px", borderRadius: 10, border: "1px solid rgba(0,255,204,0.3)", background: "transparent", color: "#00FFCC", cursor: "pointer", fontSize: 13 }}
                    onClick={() => setRespondId(respondId === r.id ? null : r.id)}
                  >
                    {respondId === r.id ? "إلغاء" : "إرسال عرض"}
                  </button>
                </div>
              </div>

              {respondId === r.id && (
                <form onSubmit={handleRespond} style={{ marginTop: 14, display: "grid", gap: 10, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
                  <textarea
                    style={{ ...input, height: 70, padding: "10px 14px", resize: "vertical" } as React.CSSProperties}
                    placeholder="رسالتك (10 أحرف على الأقل)"
                    value={respMsg}
                    onChange={e => setRespMsg(e.target.value)}
                    minLength={10}
                    required
                  />
                  <input style={input} placeholder="سعر العرض (ريال)" type="number" min={1} value={respPrice} onChange={e => setRespPrice(e.target.value)} required />
                  {respErr && <p style={{ color: "#FF6B6B", margin: 0, fontSize: 13 }}>{respErr}</p>}
                  <button style={{ ...btnPrimary, opacity: respLoading ? 0.7 : 1 }} disabled={respLoading}>
                    {respLoading ? "جاري الإرسال..." : "إرسال العرض"}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
