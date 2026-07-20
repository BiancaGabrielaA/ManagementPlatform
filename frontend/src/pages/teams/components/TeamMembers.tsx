import { useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { deleteUserFromTeam } from "../../../api/teams.api";
import type { Team } from "../../../api/teams.api";
import type { UserListItem } from "../../../api/users.api";
import AddTeamMemberModal from "../components/AddTeamMemberModal";

interface Props {
  team: Team;
  onMembersChanged: (teamId: number, updatedMembers: UserListItem[]) => void;
}

function TeamMembers({ team, onMembersChanged }: Props) {
  const { user } = useAuth();
  const canManage = user?.role === "PROJECT_MANAGER"

  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const members = team.users ?? [];

  const handleRemove = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this member from the team?")) return;
    setRemovingId(userId);
    try {
      await deleteUserFromTeam(team.id, userId);
      const updated = members.filter((m) => m.id !== userId);
      onMembersChanged(team.id, updated);
    } catch {
      setError("Unable to remove the member.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700">
          Members ({members.length})
        </h2>
        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="text-sm font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition"
          >
            + Add member
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              {canManage && <th className="px-4 py-2 font-medium"></th>}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-900">{member.name}</td>
                <td className="px-4 py-2 text-slate-600">{member.email}</td>
                <td className="px-4 py-2 text-slate-600">{member.role}</td>
                {canManage && (
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleRemove(member.id)}
                      disabled={removingId === member.id}
                      className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {removingId === member.id ? "..." : "Delete"}
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {members.length === 0 && (
              <tr>
                <td colSpan={canManage ? 4 : 3} className="px-4 py-6 text-center text-slate-400">
                  No members in this team yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddTeamMemberModal
          team={team}
          existingMembers={members}
          onClose={() => setShowAddModal(false)}
          onAdded={(updatedMembers) => {
            onMembersChanged(team.id, updatedMembers);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

export default TeamMembers;