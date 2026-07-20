import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { getSprintsByTeam, createSprint } from "../../../api/sprints.api";
import type { Sprint } from "../../../api/sprints.api";
import type { Priority } from "../../../api/tickets.api";

interface Props {
  teamId: number;
  onTicketClick: (ticketId: number) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700"
};

function TeamSprints({ teamId, onTicketClick }: Props) {
  const { user } = useAuth();
  const canManage = user?.role === "PROJECT_MANAGER";

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedSprintId, setExpandedSprintId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSprints();
  }, [teamId]);

  const fetchSprints = async () => {
    setIsLoading(true);
    try {
      const data = await getSprintsByTeam(teamId);
      setSprints(data);
    } catch {
      setError("Nu am putut încărca sprinturile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) {
      setError("Toate câmpurile sunt obligatorii.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("Data de final trebuie să fie după data de început.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const newSprint = await createSprint({ name: name.trim(), startDate, endDate, teamId });
      setSprints((prev) => [newSprint, ...prev]);
      setName("");
      setStartDate("");
      setEndDate("");
      setShowCreateForm(false);
    } catch {
      setError("Nu am putut crea sprintul.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p className="text-sm text-slate-500">Se încarcă sprinturile...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700">Sprinturi</h2>
        {canManage && (
          <button
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="text-sm font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition"
          >
            + Sprint nou
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="border border-slate-200 rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
        >
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Nume</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Sprint 1"
              className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Start</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm"
            />
          </div>
          <div className="sm:col-span-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-sm text-slate-600 px-3 py-1.5 rounded-md hover:bg-slate-100"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-sm font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? "Se creează..." : "Creează"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {sprints.map((sprint) => {
          const total = sprint.tickets.length;
          const done = sprint.tickets.filter((t) => t.status === "DONE").length;
          const progress = total === 0 ? 0 : Math.round((done / total) * 100);
          const isExpanded = expandedSprintId === sprint.id;

          return (
            <div key={sprint.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSprintId(isExpanded ? null : sprint.id)}
                className="w-full text-left p-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-900">{sprint.name}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(sprint.startDate).toLocaleDateString("ro-RO")} –{" "}
                    {new Date(sprint.endDate).toLocaleDateString("ro-RO")}
                  </p>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div
                    className="bg-slate-900 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {done}/{total} tickete completate ({progress}%)
                </p>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50">
                  {total === 0 ? (
                    <p className="text-sm text-slate-400 italic p-4">
                      Niciun ticket în acest sprint.
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="text-slate-500 text-left">
                        <tr>
                          <th className="px-4 py-2 font-medium">Titlu</th>
                          <th className="px-4 py-2 font-medium">Status</th>
                          <th className="px-4 py-2 font-medium">Prioritate</th>
                          <th className="px-4 py-2 font-medium">Assignee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sprint.tickets.map((ticket) => (
                          <tr
                            key={ticket.id}
                            onClick={() => onTicketClick(ticket.id)}
                            className="border-t border-slate-200 cursor-pointer hover:bg-slate-100"
                          >
                            <td className="px-4 py-2 text-slate-900">{ticket.title}</td>
                            <td className="px-4 py-2 text-slate-600">{ticket.status}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority]}`}
                              >
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-slate-600">
                              {ticket.assignee?.name ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {sprints.length === 0 && (
          <p className="text-sm text-slate-400 italic">Nu există sprinturi create încă.</p>
        )}
      </div>
    </div>
  );
}

export default TeamSprints;