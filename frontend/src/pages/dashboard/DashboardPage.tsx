import { useAuth } from "../../auth/AuthContext";
import AttentionQueueCard from "./components/AttentionQueueCard";
import RecentActivityCard from "./components/RecentActivityCard";

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-6">
        Welcome, {user?.name}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {user?.role !== "ADMIN" && (
          <div className="lg:col-span-2">
            <RecentActivityCard />
          </div>
        )}

         { ( user?.role === "SOFTWARE_ENGINEER" || user?.role === "SOFTWARE_TESTER" ) && (
          <div className="lg:col-span-2">
            <AttentionQueueCard/>
          </div>
        )}
      </div>

    </div>
  );
}

export default DashboardPage;