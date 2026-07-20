import { useEffect, useState } from "react";
import { X, Search, UserMinus, UserPlus } from "lucide-react";
import { getAllUsers, type UserListItem } from "@/api/users.api";
import { addUserToTeam, deleteUserFromTeam, type Team } from "@/api/teams.api";

interface Props {
  team: Team;
  onClose: () => void;
  onMembersChanged: (teamId: number, users: UserListItem[]) => void;
}

function ManageTeamMembersModal({ team, onClose, onMembersChanged }: Props) {
  const [members, setMembers] = useState<UserListItem[]>(team.users);
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);

  useEffect(() => {

    getAllUsers().then(setAllUsers).catch(() => setError(("Failed to load users.")));
  }, []);

  const memberIds = new Set(members?.map((m) => m.id));
  const availableUsers = allUsers.filter(
    (u) => !memberIds.has(u.id) && u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (user: UserListItem) => {
    setError("");
    setPendingId(user.id);
    try {
      await addUserToTeam(team.id, user.id);
      const updated = [...members, user];
      setMembers(updated);
      onMembersChanged(team.id, updated);
    } catch(error) {
      setError("I couldn't add the user to the team.");
    } finally {
      setPendingId(null);
    }
  };

  const handleRemove = async (user: UserListItem) => {
    setError("");
    setPendingId(user.id);
    try {
      await deleteUserFromTeam(team.id, user.id);
      const updated = members.filter((m) => m.id !== user.id);
      setMembers(updated);
      onMembersChanged(team.id, updated);
    } catch {
      setError("I couldn't remove the user from the team.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Manage Members — {team.name}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Current members ({members?.length})
          </p>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {members?.length === 0 && (
              <p className="text-sm text-slate-400">No team members yet.</p>
            )}
            {members?.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
                <button
                  onClick={() => handleRemove(user)}
                  disabled={pendingId === user.id}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Add member
          </p>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {availableUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
                <button
                  onClick={() => handleAdd(user)}
                  disabled={pendingId === user.id}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              </div>
            ))}
            {availableUsers.length === 0 && (
              <p className="text-sm text-slate-400">No results.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageTeamMembersModal;