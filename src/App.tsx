import { Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

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

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <div style={{ width: "min(980px, 100%)" }}>{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
