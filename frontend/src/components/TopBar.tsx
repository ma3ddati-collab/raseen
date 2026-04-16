import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const onLogin = pathname === "/login";
  const onRegister = pathname === "/register";

  function handleLogout() {
    logout();
    nav("/");
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 14px",
    borderRadius: 12,
    border: active
      ? "1px solid rgba(255,255,255,0.18)"
      : "1px solid rgba(255,255,255,0.12)",
    backgroundColor: active ? "rgba(255,255,255,0.06)" : "transparent",
    color: "#FFFFFF",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
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

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {user ? (
          <>
            <Link to="/dashboard" style={linkStyle(pathname === "/dashboard")}>لوحة التحكم</Link>
            <Link to="/kyc" style={linkStyle(pathname === "/kyc")}>التوثيق</Link>
            <Link to="/listings" style={linkStyle(pathname === "/listings")}>الإعلانات</Link>
            <Link to="/rfq" style={linkStyle(pathname === "/rfq")}>طلبات العروض</Link>
            <span style={{ color: "#8E9AAF", fontSize: 13, padding: "0 4px" }}>{user.companyName}</span>
            <button
              onClick={handleLogout}
              style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#FF6B6B", cursor: "pointer", fontSize: 14 }}
            >
              خروج
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle(onLogin)}>تسجيل الدخول</Link>
            <Link
              to="/register"
              style={{ padding: "10px 14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #00FFCC, #05A677)", color: "#0A1428", fontWeight: 800, textDecoration: "none", display: "flex", alignItems: "center", opacity: onRegister ? 0.85 : 1 }}
            >
              إنشاء حساب
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
