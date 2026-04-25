import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { card, input, btnPrimary, COLORS } from "../styles/ui";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const payload = await api.auth.register({ email, password, companyName });
      login(payload);
      nav("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <div style={{ ...card, width: "min(460px, 100%)", padding: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>إنشاء حساب</h1>
        <form onSubmit={handleSubmit} style={{ marginTop: 18, display: "grid", gap: 12 }}>
          <input
            style={input}
            placeholder="اسم المنشأة"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            required
          />
          <input
            style={input}
            placeholder="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={input}
            placeholder="كلمة المرور (8 أحرف على الأقل)"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
            required
          />
          {err && <p style={{ color: "#FF6B6B", margin: 0, fontSize: 14 }}>{err}</p>}
          <button style={{ ...btnPrimary, width: "100%", opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>
        <p style={{ marginTop: 14, textAlign: "center", color: COLORS.muted, fontSize: 14 }}>
          لديك حساب؟{" "}
          <Link to="/login" style={{ color: "#00FFCC" }}>تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
