import { Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { layoutShell } from "./styles/ui";

export default function App() {
  return (
    <div style={layoutShell}>
      <TopBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
