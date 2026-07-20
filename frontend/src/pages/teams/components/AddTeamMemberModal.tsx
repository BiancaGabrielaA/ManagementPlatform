import { useEffect, useState } from "react";
import { getAllUsers } from "../../../api/users.api";
import { addUserToTeam } from "../../../api/teams.api";
import type { Team } from "../../../api/teams.api";
import type { UserListItem } from "../../../api/users.api";

interface Props {
  team: Team;
  existingMembers: UserListItem[];
  onClose: () => void;
  onAdded: (updatedMembers: UserListItem[]) => void;
}

function AddTeamMemberModal({ team, existingMembers, onClose, onAdded }: Props) {
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);

  useEffect(() => {
    getAllUsers()
      .then(setAllUsers)
      .catch(() => setError("Nu am putut încărca userii."));
  }, []);

  const existingIds = new Set(existingMembers.map((m) => m.id));
  const availableUsers = allUsers.filter(
    (u) =>
      !existingIds.has(u.id) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = async (user: UserListItem) => {
    setError("");
    setPendingId(user.id);
    try {
      await addUserToTeam(team.id, user.id);
      onAdded([...existingMembers, user]);
    } catch {
      setError("Nu am putut adăuga userul în echipă.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Adaugă membru</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută după nume sau email..."
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mb-3"
          autoFocus
        />

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <div className="overflow-y-auto flex-1 space-y-1">
          {availableUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50"
            >
              <div>
                <p className="text-sm text-slate-900">{u.name}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
              </div>
              <button
                onClick={() => handleAdd(u)}
                disabled={pendingId === u.id}
                className="text-xs font-medium text-slate-900 border border-slate-200 rounded-md px-2 py-1 hover:bg-slate-100 disabled:opacity-50"
              >
                {pendingId === u.id ? "..." : "Adaugă"}
              </button>
            </div>
          ))}

          {availableUsers.length === 0 && (
            <p className="text-sm text-slate-400 italic text-center py-4">
              Niciun rezultat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddTeamMemberModal;