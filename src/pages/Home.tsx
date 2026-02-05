import { card, pageCenter } from "../styles/ui";

export default function Home() {
  return (
    <div style={pageCenter}>
      <div style={{ ...card, width: "min(980px, 100%)" }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.2 }}>
          رصين… منصة تداول سيادية
          <br />
          للمعدات الثقيلة
        </h1>

        <p style={{ marginTop: 12, color: "#8E9AAF", lineHeight: 1.8 }}>
          نُسيّل الأصول المحبوسة، ونرفع الثقة فوق العشوائية.
          دخول المنصة للمؤسسات الموثقة فقط — والمعاملات تُدار بمنطق مؤسسي قابل للتوسع.
        </p>

        <div
          style={{
            marginTop: 18,
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
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>{x.t}</div>
              <div style={{ color: "#8E9AAF", lineHeight: 1.7 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
