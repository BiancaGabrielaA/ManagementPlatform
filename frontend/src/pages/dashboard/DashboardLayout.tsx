import { Outlet } from "react-router-dom";
import DashboardNavbar from "./components/DashboardNavbar";

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardNavbar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;