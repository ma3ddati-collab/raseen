import { card, input, btnPrimary } from "../styles/ui";

export default function Login() {
  return (
    <div style={{ ...card, padding: 22 }}>
      <h2 style={{ margin: 0, fontSize: 28 }}>تسجيل الدخول</h2>
      <p style={{ marginTop: 8, color: "#8E9AAF" }}>
        صفحة مؤقتة — نبني نموذج الدخول بعد شوي.
      </p>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        <input style={input} placeholder="البريد الإلكتروني" />
        <input style={input} placeholder="كلمة المرور" type="password" />
        <button style={{ ...btnPrimary, width: "100%" }}>دخول</button>
      </div>
    </div>
  );
}
