export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A1428",
        color: "#FFFFFF",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "rgba(17, 28, 49, 0.55)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #00FFCC, #05A677)",
            }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 800, letterSpacing: 0.5 }}>رصين</div>
            <div style={{ fontSize: 12, color: "#8E9AAF" }}>
              للشركات والمؤسسات الموثقة فقط
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              backgroundColor: "transparent",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            تسجيل الدخول
          </button>
          <button
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #00FFCC, #05A677)",
              color: "#0A1428",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            إنشاء حساب
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <div style={{ width: "min(980px, 100%)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 18,
              alignItems: "stretch",
            }}
          >
            {/* Hero */}
            <div
              style={{
                padding: 22,
                borderRadius: 18,
                backgroundColor: "#111C31",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
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

              <h1
                style={{
                  margin: 0,
                  fontSize: 42,
                  letterSpacing: 0.2,
                  lineHeight: 1.15,
                }}
              >
                رصين… منصة تداول سيادية
                <br />
                للمعدات الثقيلة
              </h1>

              <p
                style={{
                  marginTop: 12,
                  marginBottom: 18,
                  color: "#8E9AAF",
                  fontSize: 16,
                  lineHeight: 1.8,
                }}
              >
                نُسيّل الأصول المحبوسة، ونرفع الثقة فوق العشوائية.
                دخول المنصة للمؤسسات الموثقة فقط — والمعاملات تُدار بمنطق
                مؤسسي قابل للتوسع.
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
            </div>

            {/* Cards */}
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { title: "التحقق السيادي", desc: "فلترة مؤسسية + سجلات موثقة." },
                { title: "نظام عمولة واضح", desc: "عمولة 10% تُقتطع آليًا." },
                { title: "قابلية دمج عميقة", desc: "API للجهات لاحقًا." },
              ].map((c) => (
                <div
                  key={c.title}
                  style={{
                    padding: 18,
                    borderRadius: 18,
                    backgroundColor: "#111C31",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>
                    {c.title}
                  </div>
                  <div style={{ color: "#8E9AAF", lineHeight: 1.7 }}>
                    {c.desc}
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
}
