// src/styles/ui.ts
export const COLORS = {
  bg: "#0A1428",
  panel: "#111C31",
  text: "#FFFFFF",
  muted: "#8E9AAF",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.12)",
  glow: "rgba(0,0,0,0.35)",
  grad: "linear-gradient(135deg, #00FFCC, #05A677)",
};

export const layoutShell: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: COLORS.bg,
  color: COLORS.text,
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  display: "flex",
  flexDirection: "column",
};

export const pageCenter: React.CSSProperties = {
  flex: 1,
  display: "grid",
  placeItems: "center",
  padding: 24,
};

export const card: React.CSSProperties = {
  padding: 24,
  borderRadius: 22,
  backgroundColor: COLORS.panel,
  border: `1px solid ${COLORS.border}`,
  boxShadow: `0 20px 60px ${COLORS.glow}`,
};

export const input: React.CSSProperties = {
  height: 46,
  borderRadius: 14,
  border: `1px solid ${COLORS.borderStrong}`,
  backgroundColor: "rgba(255,255,255,0.04)",
  color: COLORS.text,
  padding: "0 14px",
  outline: "none",
};

export const btnPrimary: React.CSSProperties = {
  height: 46,
  borderRadius: 14,
  border: "none",
  background: COLORS.grad,
  color: COLORS.bg,
  fontWeight: 900,
  cursor: "pointer",
};

export const btnGhost: React.CSSProperties = {
  height: 46,
  borderRadius: 14,
  border: `1px solid ${COLORS.borderStrong}`,
  backgroundColor: "transparent",
  color: COLORS.text,
  fontWeight: 700,
  cursor: "pointer",
};
