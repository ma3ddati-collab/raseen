import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A1428",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "48px", marginBottom: "12px" }}>رصين</h1>
        <p style={{ fontSize: "18px", color: "#8E9AAF" }}>
          البنية السيادية للمنصات الذكية
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
