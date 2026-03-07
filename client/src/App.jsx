import { Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "./store/useAuth";
import { startVisit, endVisit } from "./services/api";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import History from "./pages/History";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

export default function App() {
  const { user } = useAuth();
  const visitIdRef = useRef(null);

  // Visitor tracking — fires on every session
  useEffect(() => {
    startVisit(user?.id || null)
      .then((r) => { visitIdRef.current = r.data.visitId; })
      .catch(() => {});

    return () => {
      if (visitIdRef.current) {
        endVisit(visitIdRef.current).catch(() => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/analysis/:paperId" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}