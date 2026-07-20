import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { getBacklog } from "../../../api/tickets.api";
import type { Ticket, Priority } from "../../../api/tickets.api";
import { getSprintsByTeam, assignTicketToSprint } from "../../../api/sprints.api";
import type { Sprint } from "../../../api/sprints.api";

interface Props {
  teamId: number;
  onTicketClick: (ticketId: number) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700"
};

function TeamBacklog({ teamId, onTicketClick }: Props) {
  const { user } = useAuth();
  const canManage = user?.role === "PROJECT_MANAGER";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigningId, setAssigningId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [teamId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [backlogData, sprintsData] = await Promise.all([
        getBacklog(teamId),
        getSprintsByTeam(teamId),
      ]);
      setTickets(backlogData);
      setSprints(sprintsData);
    } catch {
      setError("Nu am putut încărca backlog-ul.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (ticketId: number, sprintId: number) => {
    setAssigningId(ticketId);
    try {
      await assignTicketToSprint(sprintId, ticketId);
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch {
      setError("Nu am putut adăuga ticketul în sprint.");
    } finally {
      setAssigningId(null);
    }
  };

  if (isLoading) return <p className="text-sm text-slate-500">Loading backlog...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-700">Backlog</h2>
        <p className="text-xs text-slate-400 mt-1">
          Unassigned Tickets ({tickets.length})
        </p>
      </div>

      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onTicketClick(ticket.id)}
            className="flex items-center justify-between border border-slate-200 rounded-lg p-3"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span
                className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_COLORS[ticket.priority]}`}
              >
                {ticket.priority}
              </span>
              <p className="text-sm text-slate-900 truncate">{ticket.title}</p>
              {ticket.assignee && (
                <span className="text-xs text-slate-400 shrink-0">
                  {ticket.assignee.name}
                </span>
              )}
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <p className="text-sm text-slate-400 italic">The backlog is empty.</p>
        )}
      </div>
    </div>
  );
}

export default TeamBacklog;