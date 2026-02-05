import { Link, useLocation } from "react-router-dom";

export default function TopBar() {
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  const pillStyle = (active: boolean) => ({
    padding: "10px 14px",
    borderRadius: 12,
    border: active
      ? "1px solid rgba(255,255,255,0.18)"
      : "1px solid rgba(255,255,255,0.12)",
    backgroundColor: active ? "rgba(255,255,255,0.06)" : "transparent",
    color: "#FFFFFF",
    textDecoration: "none",
    display: "flex",
    alignItems: "center" as const,
    gap: 8,
    cursor: "pointer",
  });

  return (
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
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "#FFFFFF",
        }}
      >
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
      </Link>

      <div style={{ display: "flex", gap: 10 }}>
        <Link to="/login" style={pillStyle(isActive("/login"))}>
          تسجيل الدخول
        </Link>

        <Link
          to="/register"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #00FFCC, #05A677)",
            color: "#0A1428",
            fontWeight: 800,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          إنشاء حساب
        </Link>
      </div>
    </div>
  );
}
