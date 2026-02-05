import { card, input, btnPrimary, pageCenter } from "../styles/ui";

export default function Login() {
  return (
    <div style={pageCenter}>
      <div style={{ ...card, width: "min(520px, 100%)" }}>
        <h1 style={{ margin: 0, fontSize: 34 }}>تسجيل الدخول</h1>
        <p style={{ marginTop: 10, color: "#8E9AAF", lineHeight: 1.7 }}>
          صفحة مؤقتة — بنبني نموذج الدخول بعد شوي.
        </p>

        <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
          <input placeholder="البريد الإلكتروني" style={input} />
          <input placeholder="كلمة المرور" type="password" style={input} />
          <button style={btnPrimary}>دخول</button>
        </div>
      </div>
    </div>
  );
}
