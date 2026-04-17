import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Listing } from "../lib/api";
import { card, input, btnPrimary, COLORS } from "../styles/ui";

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setListings(await api.listings.list());
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const item = await api.listings.create({
        title,
        category,
        description,
        price: Number(price),
      });
      setListings(prev => [item, ...prev]);
      setShowForm(false);
      setTitle(""); setCategory(""); setDescription(""); setPrice("");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>الإعلانات</h2>
        <button style={btnPrimary} onClick={() => setShowForm(v => !v)}>
          {showForm ? "إلغاء" : "+ إعلان جديد"}
        </button>
      </div>

      {showForm && (
        <div style={{ ...card, padding: 24, marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>إضافة إعلان</h3>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: 12 }}>
            <input style={input} placeholder="العنوان" value={title} onChange={e => setTitle(e.target.value)} required />
            <input style={input} placeholder="الفئة (مثل: معدات ثقيلة)" value={category} onChange={e => setCategory(e.target.value)} required />
            <textarea
              style={{ ...input, height: 90, padding: "10px 14px", resize: "vertical" } as React.CSSProperties}
              placeholder="وصف تفصيلي (10 أحرف على الأقل)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              minLength={10}
              required
            />
            <input style={input} placeholder="السعر (ريال)" type="number" min={1} value={price} onChange={e => setPrice(e.target.value)} required />
            {err && <p style={{ color: "#FF6B6B", margin: 0, fontSize: 14 }}>{err}</p>}
            <button style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
              {submitting ? "جاري النشر..." : "نشر الإعلان"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: COLORS.muted }}>جاري التحميل...</p>
      ) : listings.length === 0 ? (
        <div style={{ ...card, padding: 24, textAlign: "center", color: COLORS.muted }}>
          لا توجد إعلانات بعد.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {listings.map(l => (
            <div key={l.id} style={{ ...card, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{l.title}</div>
                  <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>
                    {l.category} · {new Date(l.createdAt).toLocaleDateString("ar-SA")}
                  </div>
                  <div style={{ marginTop: 8, color: COLORS.muted, fontSize: 14 }}>{l.description}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginRight: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#00FFCC" }}>
                    {l.price.toLocaleString()} {l.currency}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{l.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
