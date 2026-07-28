import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import SecureVoteHero from "./pages/SecureVoteHero.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import ElectionsManagement from "./pages/ElectionsManagement";
import CandidatesManagement from "./pages/CandidatesManagement";
import VoterManagement from "./pages/VoterManagement";
import VoterDashboard from "./pages/VoterDashboard";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import VoterCardsRoute from "./pages/VoterCardsRoute";
import AdminLayout from "./layouts/AdminLayout";
import { ConfirmProvider } from "./context/ConfirmContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("securevote_user"));
  } catch {
    return null;
  }
};

const AppRoutes = () => {
  const [user, setUser] = useState(storedUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem("securevote_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("securevote_user");
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login/voter");
  };

  const requireAdmin = (element) => {
    // Viewer role can only see results
    if (user?.roleType === "Viewer" && user?.role === "admin") {
      // Only allow /admin/results
      const path = window.location.pathname;
      if (path !== "/admin/results") {
        return <Navigate to="/admin/results" replace />;
      }
      return <AdminLayout user={user} onLogout={handleLogout}>{element}</AdminLayout>;
    }

    return user?.role === "admin" ? (
      <AdminLayout user={user} onLogout={handleLogout}>{element}</AdminLayout>
    ) : (
      <Navigate to="/login/admin" replace />
    );
  };

  const requireVoter = (element) =>
    user?.role === "voter" ? element : <Navigate to="/login/voter" replace />;

  return (
    <>
      <Routes>
        <Route path="/" element={<SecureVoteHero onGetStarted={() => navigate("/login/voter")} />} />
        <Route path="/login" element={<LoginPage onLogin={setUser} mode="voter" />} />
        <Route path="/login/admin" element={<LoginPage onLogin={setUser} mode="admin" />} />
        <Route path="/login/voter" element={<LoginPage onLogin={setUser} mode="voter" />} />
        <Route path="/admin" element={requireAdmin(<AdminDashboard />)} />
        <Route path="/admin/elections" element={requireAdmin(<ElectionsManagement />)} />
        <Route path="/admin/candidates" element={requireAdmin(<CandidatesManagement />)} />
        <Route path="/admin/voters" element={requireAdmin(<VoterManagement />)} />
        <Route path="/admin/cards" element={requireAdmin(<VoterCardsRoute />)} />
        <Route path="/admin/results" element={requireAdmin(<Results />)} />
        <Route path="/admin/settings" element={requireAdmin(<Settings />)} />
        <Route path="/voter" element={requireVoter(<VoterDashboard user={user} onLogout={handleLogout} />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2600} newestOnTop />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ConfirmProvider>
            <AppRoutes />
          </ConfirmProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App
