import { useEffect, useState } from "react";
import { api, KycProfile } from "../lib/api";
import { card, input, btnPrimary, COLORS } from "../styles/ui";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "معلّق",
  SUBMITTED: "مُقدَّم",
  UNDER_REVIEW: "قيد المراجعة",
  APPROVED: "موافق عليه ✓",
  REJECTED: "مرفوض",
};

const STATUS_COLOR: Record<string, string> = {
  APPROVED: "#00FFCC",
  REJECTED: "#FF6B6B",
  SUBMITTED: "#F5A623",
  UNDER_REVIEW: "#F5A623",
  PENDING: COLORS.muted,
};

export default function KYC() {
  const [profile, setProfile] = useState<KycProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [legalName, setLegalName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.kyc.me().then(p => { setProfile(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      const p = await api.kyc.submit({ legalName, nationalId, documentUrl });
      setProfile(p);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p style={{ color: COLORS.muted }}>جاري التحميل...</p>;

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ marginTop: 0 }}>توثيق الهوية (KYC)</h2>

      {profile ? (
        <div style={{ ...card, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{profile.legalName}</h3>
            <span style={{ color: STATUS_COLOR[profile.status] ?? COLORS.muted, fontWeight: 700 }}>
              {STATUS_LABEL[profile.status] ?? profile.status}
            </span>
          </div>
          <div style={{ marginTop: 12, display: "grid", gap: 6, color: COLORS.muted, fontSize: 14 }}>
            <div>رقم الهوية الوطنية: {profile.nationalId}</div>
            <div>
              وثيقة:{" "}
              <a href={profile.documentUrl} target="_blank" rel="noreferrer" style={{ color: "#00FFCC" }}>
                عرض الوثيقة
              </a>
            </div>
            {profile.reviewNotes && <div>ملاحظات المراجع: {profile.reviewNotes}</div>}
          </div>
        </div>
      ) : (
        <div style={{ ...card, padding: 24 }}>
          <p style={{ marginTop: 0, color: COLORS.muted }}>
            أرسل بيانات منشأتك للمراجعة والتوثيق.
          </p>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <input
              style={input}
              placeholder="الاسم القانوني للمنشأة"
              value={legalName}
              onChange={e => setLegalName(e.target.value)}
              required
            />
            <input
              style={input}
              placeholder="رقم الهوية الوطنية / السجل التجاري"
              value={nationalId}
              onChange={e => setNationalId(e.target.value)}
              required
            />
            <input
              style={input}
              placeholder="رابط الوثيقة (https://...)"
              type="url"
              value={documentUrl}
              onChange={e => setDocumentUrl(e.target.value)}
              required
            />
            {err && <p style={{ color: "#FF6B6B", margin: 0, fontSize: 14 }}>{err}</p>}
            <button style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
              {submitting ? "جاري الإرسال..." : "إرسال للمراجعة"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
