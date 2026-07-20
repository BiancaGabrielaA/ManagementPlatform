import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { getTicketsByTeam, deleteTicket } from "../../../api/tickets.api";
import type { Ticket, TicketStatus, Priority } from "../../../api/tickets.api";
import CreateTicketModal from "../components/CreateTicketModal";

interface Props {
  teamId: number;
  onTicketClick: (ticketId: number) => void;
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700"
};

function TeamTickets({ teamId, onTicketClick}: Props) {
  const { user } = useAuth();
  const canManage = user?.role === "PROJECT_MANAGER";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<number | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "priority">("createdAt");

  useEffect(() => {
    fetchTickets();
  }, [teamId]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await getTicketsByTeam(teamId);
      setTickets(data);
    } catch {
      setError("Nu am putut încărca ticketele.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (ticketId: number) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    setDeletingId(ticketId);
    try {
      await deleteTicket(ticketId);
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch {
      setError("Failed to delete the ticket.");
    } finally {
      setDeletingId(null);
    }
  };

  const assignees = useMemo(() => {
    const map = new Map<number, string>();
    tickets.forEach((t) => {
      if (t.assignee) map.set(t.assignee.id, t.assignee.name);
    });
    return Array.from(map.entries());
  }, [tickets]);

  const priorityOrder: Record<Priority, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 };

  const filteredTickets = useMemo(() => {
    let result = [...tickets];
    if (statusFilter !== "ALL") result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "ALL") result = result.filter((t) => t.priority === priorityFilter);
    if (assigneeFilter !== "ALL") result = result.filter((t) => t.assignee?.id === assigneeFilter);

    result.sort((a, b) => {
      if (sortBy === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [tickets, statusFilter, priorityFilter, assigneeFilter, sortBy]);

  if (isLoading) return <p className="text-sm text-slate-500">Loading tickets...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "ALL")}
            className="text-sm border border-slate-200 rounded-md px-2 py-1"
          >
            <option value="ALL">Toate statusurile</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | "ALL")}
            className="text-sm border border-slate-200 rounded-md px-2 py-1"
          >
            <option value="ALL">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) =>
              setAssigneeFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
            }
            className="text-sm border border-slate-200 rounded-md px-2 py-1"
          >
            <option value="ALL">All members</option>
            {assignees.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "createdAt" | "priority")}
            className="text-sm border border-slate-200 rounded-md px-2 py-1"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>

        {canManage && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-sm font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition"
          >
            + Add new ticket
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Priority</th>
              <th className="px-4 py-2 font-medium">Assignee</th>
              <th className="px-4 py-2 font-medium">Created</th>
              {canManage && <th className="px-4 py-2 font-medium"></th>}
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}  onClick={() => onTicketClick(ticket.id)} className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-900">{ticket.title}</td>
                <td className="px-4 py-2 text-slate-600">{STATUS_LABELS[ticket.status]}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600">
                  {ticket.assignee?.name ?? "—"}
                </td>
                <td className="px-4 py-2 text-slate-400">
                  {new Date(ticket.createdAt).toLocaleDateString("ro-RO")}
                </td>
                {canManage && (
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      disabled={deletingId === ticket.id}
                      className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingId === ticket.id ? "..." : "Șterge"}
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="px-4 py-6 text-center text-slate-400">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <CreateTicketModal
          teamId={teamId}
          onClose={() => setShowCreateModal(false)}
          onCreated={(newTicket) => {
            setTickets((prev) => [newTicket, ...prev]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

export default TeamTickets;