import { useEffect, useState } from "react";
import { createTicket } from "../../../api/tickets.api";
import type { Ticket, Priority } from "../../../api/tickets.api";
import { getTeamById } from "../../../api/teams.api";
import type { UserListItem } from "../../../api/users.api";
import type { CreateTicketDto } from "../../../api/tickets.api";

interface Props {
  teamId: number;
  onClose: () => void;
  onCreated: (ticket: Ticket) => void;
}

function CreateTicketModal({ teamId, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [assigneeId, setAssigneeId] = useState<number | "">("");
  const [members, setMembers] = useState<UserListItem[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getTeamById(teamId)
      .then((team) => setMembers(team.users ?? []))
      .catch(() => setError("Nu am putut încărca membrii echipei."));
  }, [teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Titlul este obligatoriu.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    
    try {
      const dto: CreateTicketDto = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        teamId,
        assigneeId: assigneeId === "" ? null : assigneeId,
        };
      const newTicket = await createTicket(dto);
      onCreated(newTicket);
    } catch {
      setError("Nu am putut crea ticketul.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">New Ticket</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
              placeholder="Ex: Fix login bug"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm resize-none"
              rows={3}
              placeholder="Detalii despre ticket (opțional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) =>
                  setAssigneeId(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Neasignat</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-slate-600 px-3 py-1.5 rounded-md hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-sm font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketModal;