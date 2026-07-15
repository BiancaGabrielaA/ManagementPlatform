import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

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
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Aici vei adăuga pe viitor */}
          {/* <Route path="/teams" element={<TeamsPage />} /> */}
          {/* <Route path="/tickets" element={<TicketsPage />} /> */}
          {/* <Route path="/users" element={<UsersPage />} /> */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;