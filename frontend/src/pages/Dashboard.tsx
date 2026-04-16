import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { card, COLORS } from "../styles/ui";

const NAV_ITEMS = [
  { to: "/kyc", label: "توثيق الهوية", desc: "أرسل وثائق منشأتك للمراجعة", icon: "🔐" },
  { to: "/listings", label: "الإعلانات", desc: "تصفح وأنشئ إعلانات المعدات", icon: "📋" },
  { to: "/rfq", label: "طلبات العروض", desc: "أرسل واستقبل طلبات العروض", icon: "📨" },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ marginTop: 0 }}>مرحباً، {user?.companyName}</h1>
      <p style={{ color: COLORS.muted, marginTop: 0 }}>منصة رصين لتداول المعدات الثقيلة</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 24 }}>
        {NAV_ITEMS.map(item => (
          <Link key={item.to} to={item.to} style={{ textDecoration: "none" }}>
            <div style={{ ...card, padding: 22, cursor: "pointer", transition: "border-color 0.2s", borderColor: "rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{item.label}</div>
              <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 6 }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
