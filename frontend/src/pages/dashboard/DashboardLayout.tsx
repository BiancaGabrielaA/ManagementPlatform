import { Outlet } from "react-router-dom";
import DashboardNavbar from "./components/DashboardNavbar";

function DashboardLayout() {
  return (
    <div className="flex">
      <DashboardNavbar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;