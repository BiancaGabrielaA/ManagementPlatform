import { useEffect, useState } from "react";
import { Plus, Trash2, Users as UsersIcon } from "lucide-react";
import { getAllTeams, type Team } from "@/api/teams.api";
import type { UserListItem } from "@/api/users.api";
import CreateTeamModal from "./components/CreateTeamModal";
import DeleteTeamModal from "./components/DeleteTeamModal";
import ManageTeamMembersModal from "./components/ManageTeamMembersModal";

function ManageTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [managingTeam, setManagingTeam] = useState<Team | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTeams();
      setTeams(data);
    } catch {
      setError("Failed to load the team.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMembersChanged = (teamId: number, users: UserListItem[]) => {
    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, users } : t)));
    setManagingTeam((prev) => (prev && prev.id === teamId ? { ...prev, users } : prev));
  };

  if (isLoading) {
    return <div className="p-8 text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Teams</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Team
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {teams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500">
          No team created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-slate-900">{team.name}</h3>
                <button
                  onClick={() => setDeletingTeam(team)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="mb-4 flex-1 text-sm text-slate-500">
                {team.description || "No description"}
              </p>

              <button
                onClick={() => setManagingTeam(team)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <UsersIcon className="h-4 w-4" />
                {team.users?.length ?? 0} member{team.users?.length !== 1 ? "s" : ""} · Manage
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateTeamModal
          onClose={() => setShowCreate(false)}
          onCreated={(team) => setTeams((prev) => [...prev, team])}
        />
      )}

      {deletingTeam && (
        <DeleteTeamModal
          team={deletingTeam}
          onClose={() => setDeletingTeam(null)}
          onDeleted={(id) => setTeams((prev) => prev.filter((t) => t.id !== id))}
        />
      )}

      {managingTeam && (
        <ManageTeamMembersModal
          team={managingTeam}
          onClose={() => setManagingTeam(null)}
          onMembersChanged={handleMembersChanged}
        />
      )}
    </div>
  );
}

export default ManageTeamsPage;