import { useEffect, useMemo, useState } from "react";
import { getMyTickets } from "../../api/tickets.api";
import type { Ticket, TicketStatus, Priority } from "../../api/tickets.api";
import TicketDetailModal from "../teams/components/TicketDetailModal";

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

function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await getMyTickets();
      setTickets(data);
    } catch {
      setError("Nu am putut încărca ticketele.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tickets;
    return tickets.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        String(t.id).includes(query)
    );
  }, [tickets, search]);

  if (isLoading) return <p className="p-6 text-sm text-slate-500">Se încarcă ticketele...</p>;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Ticketele mele</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Caută după titlu sau ID..."
        className="w-full max-w-sm text-sm border border-slate-200 rounded-md px-3 py-2 mb-4"
      />

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">ID</th>
              <th className="px-4 py-2 font-medium">Titlu</th>
              <th className="px-4 py-2 font-medium">Echipă</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Prioritate</th>
              <th className="px-4 py-2 font-medium">Sprint</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="border-t border-slate-100 cursor-pointer hover:bg-slate-50"
              >
                <td className="px-4 py-2 text-slate-400 font-mono text-xs">#{ticket.id}</td>
                <td className="px-4 py-2 text-slate-900">{ticket.title}</td>
                <td className="px-4 py-2 text-slate-600">{ticket.team?.name ?? "—"}</td>
                <td className="px-4 py-2 text-slate-600">{STATUS_LABELS[ticket.status]}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600">{ticket.sprint?.name ?? "Backlog"}</td>
              </tr>
            ))}

            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  {search ? "Niciun rezultat." : "Nu ai tickete asignate."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <TicketDetailModal
          ticketId={selectedTicket.id}
          teamId={selectedTicket.teamId}
          onClose={() => setSelectedTicket(null)}
          onUpdated={(updated) => {
            setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          }}
        />
      )}
    </div>
  );
}

export default MyTicketsPage;