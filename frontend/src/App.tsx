import { Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import KYC from "./pages/KYC";
import Listings from "./pages/Listings";
import RFQ from "./pages/RFQ";

function Layout({ children }: { children: React.ReactNode }) {
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
      <TopBar />
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ width: "min(980px, 100%)", margin: "0 auto" }}>{children}</div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
      <Route path="/kyc" element={<Layout><ProtectedRoute><KYC /></ProtectedRoute></Layout>} />
      <Route path="/listings" element={<Layout><ProtectedRoute><Listings /></ProtectedRoute></Layout>} />
      <Route path="/rfq" element={<Layout><ProtectedRoute><RFQ /></ProtectedRoute></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
