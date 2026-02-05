import { card, input, btnPrimary, pageCenter } from "../styles/ui";

export default function Register() {
  return (
    <div style={pageCenter}>
      <div style={{ ...card, width: "min(520px, 100%)" }}>
        <h1 style={{ margin: 0, fontSize: 34 }}>إنشاء حساب</h1>
        <p style={{ marginTop: 10, color: "#8E9AAF", lineHeight: 1.7 }}>
          صفحة مؤقتة — بنبني نموذج التسجيل بعد شوي.
        </p>

        <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
          <input placeholder="اسم المنشأة" style={input} />
          <input placeholder="البريد الإلكتروني" style={input} />
          <button style={btnPrimary}>إنشاء</button>
        </div>
      </div>
    </div>
  );
}
