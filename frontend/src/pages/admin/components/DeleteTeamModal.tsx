import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { deleteTeam, type Team } from "@/api/teams.api";

interface Props {
  team: Team;
  onClose: () => void;
  onDeleted: (id: number) => void;
}

function DeleteTeamModal({ team, onClose, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);
    try {
      await deleteTeam(team.id);
      onDeleted(team.id);
      onClose();
    } catch {
      setError("Failed to delete the team. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Delete Team</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the team{" "}
            <span className="font-semibold text-slate-900">{team.name}</span>?
            This action cannot be undone and will permanently delete the team and all associated data.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete team"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTeamModal;