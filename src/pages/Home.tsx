import { card } from "../styles/ui";

export default function Home() {
  return (
    <div
      style={{
        width: "min(980px, 100%)",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: 18,
        alignItems: "stretch",
      }}
    >
      {/* Hero */}
      <div style={{ ...card, padding: 22, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#8E9AAF",
            fontSize: 12,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              backgroundColor: "#00FFCC",
              display: "inline-block",
            }}
          />
          بنية تحتية ناعمة لتداول الأصول الثقيلة
        </div>

        <h1 style={{ margin: 0, fontSize: 42, letterSpacing: 0.2, lineHeight: 1.15 }}>
          رصين… منصة تداول سيادية
          <br />
          للمعدات الثقيلة
        </h1>

        <p style={{ marginTop: 12, marginBottom: 18, color: "#8E9AAF", fontSize: 16, lineHeight: 1.8 }}>
          نُسيّل الأصول المحبوسة، ونرفع الثقة فوق العشوائية. دخول المنصة للمؤسسات الموثقة فقط —
          والمعاملات تُدار بمنطق مؤسسي قابل للتوسع.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #00FFCC, #05A677)",
              color: "#0A1428",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            ابدأ التوثيق عبر نفاذ
          </button>

          <button
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              backgroundColor: "transparent",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            عرض الفئات
          </button>
        </div>

        <div style={{ marginTop: 14, color: "#8E9AAF", fontSize: 12, textAlign: "center", opacity: 0.9 }}>
          Raseen Authority — Soft Infrastructure for Heavy Assets
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gap: 12 }}>
        {[
          { title: "التحقق السيادي", desc: "فلترة مؤسسية + سجلات موثقة." },
          { title: "نظام عمولة واضح", desc: "عمولة 10% تُقتطع آليًا." },
          { title: "قابلية دمج عميقة", desc: "API للجهات لاحقًا." },
        ].map((c) => (
          <div key={c.title} style={{ ...card, padding: 18 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>{c.title}</div>
            <div style={{ color: "#8E9AAF", lineHeight: 1.7 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
