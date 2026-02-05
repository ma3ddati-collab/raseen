import { Link } from "react-router-dom";
import { card, pageCenter, btnPrimary, btnGhost } from "../styles/ui";

export default function Home() {
  return (
    <div style={pageCenter}>
      <div style={{ width: "min(980px, 100%)" }}>
        <div
          style={{
            ...card,
            padding: 28,
          }}
        >
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

          <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.15 }}>
            رصين… منصة تداول سيادية
            <br />
            للمعدات الثقيلة
          </h1>

          <p style={{ marginTop: 12, color: "#8E9AAF", lineHeight: 1.9 }}>
            نُسيّل الأصول المحبوسة، ونرفع الثقة فوق العشوائية.
            دخول المنصة للمؤسسات الموثقة فقط — والمعاملات تُدار بمنطق مؤسسي قابل للتوسع.
          </p>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button style={{ ...btnPrimary, padding: "0 16px" }}>
                ابدأ التوثيق
              </button>
            </Link>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <button style={{ ...btnGhost, padding: "0 16px" }}>
                دخول الشركات
              </button>
            </Link>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {[
            { t: "التحقق السيادي", d: "فلترة مؤسسية + سجلات موثقة." },
            { t: "عمولة واضحة", d: "10% تُقتطع آليًا من الصفقة." },
            { t: "قابلية دمج", d: "جاهزية API للمرحلة القادمة." },
          ].map((x) => (
            <div
              key={x.t}
              style={{
                ...card,
                padding: 16,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>{x.t}</div>
              <div style={{ color: "#8E9AAF", lineHeight: 1.7 }}>{x.d}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 14,
            color: "#8E9AAF",
            fontSize: 12,
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          Raseen Authority — Soft Infrastructure for Heavy Assets
        </div>
      </div>
    </div>
  );
}
