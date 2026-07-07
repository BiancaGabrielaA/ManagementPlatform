
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
// import DashboardPage from "./features/dashboard/DashboardPage";

function App() {
  const isAuthenticated = false; // momentan

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </>
        ) : (
          <>
            {/* <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} /> */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;