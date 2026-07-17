import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import NotFoundPage from "./pages/notfound/NotFoundPage";
import ManageTeamsPage from "./pages/admin/ManageTeamsPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout/>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/teams" element={<ManageTeamsPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;