import { useEffect, useState } from "react";
import { getTicketsByTeam, updateTicketStatus } from "../../../api/tickets.api";
import type { Ticket, TicketStatus } from "../../../api/tickets.api";

const COLUMNS: { key: TicketStatus; label: string }[] = [
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "DONE", label: "Done" },
];

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700"
};

interface Props {
  teamId: number;
  onTicketClick: (ticketId: number) => void;
}

function TeamBoard({ teamId, onTicketClick }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedId, setDraggedId] = useState<number | null>(null);

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

  const handleDrop = async (newStatus: TicketStatus) => {
    if (draggedId === null) return;
    const ticket = tickets.find((t) => t.id === draggedId);
    if (!ticket || ticket.status === newStatus) {
      setDraggedId(null);
      return;
    }

    const previousTickets = tickets;
    setTickets((prev) =>
      prev.map((t) => (t.id === draggedId ? { ...t, status: newStatus } : t))
    );
    setDraggedId(null);

    try {
      await updateTicketStatus(draggedId, newStatus);
    } catch {
      setError("Failed to update the ticket.");
      setTickets(previousTickets); 
    }
  };

  if (isLoading) return <p className="text-sm text-slate-500">Loading board...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((column) => {
        const columnTickets = tickets.filter((t) => t.status === column.key);
        return (
          <div
            key={column.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(column.key)}
            className="bg-slate-50 rounded-lg p-3 min-h-[400px]"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">{column.label}</h3>
              <span className="text-xs text-slate-400">{columnTickets.length}</span>
            </div>

            <div className="space-y-2">
              {columnTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  draggable
                  onDragStart={() => setDraggedId(ticket.id)}
                  onClick={() => onTicketClick(ticket.id)}
                  className="bg-white rounded-md border border-slate-200 p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-slate-300 transition"
                >
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    {ticket.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        PRIORITY_COLORS[ticket.priority] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    {ticket.assignee && (
                      <span className="text-xs text-slate-400">
                        {ticket.assignee.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {columnTickets.length === 0 && (
                <p className="text-xs text-slate-400 italic">No ticket</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TeamBoard;