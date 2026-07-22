import { useEffect, useState } from "react";
import { getNeedsAttention } from "../../../api/tickets.api";
import type { Ticket } from "../../../api/tickets.api";

function daysAgo(dateString: string): number {
  const diff = Date.now() - new Date(dateString).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function AttentionQueueCard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getNeedsAttention()
      .then(setTickets)
      .catch(() => setError("Could not load tickets."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-base font-semibold text-slate-900 tracking-tight">
          Needs Your Attention
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          High priority or waiting
        </span>
      </div>

      {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <>
          {tickets.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-4">
              You're all caught up.
            </p>
          ) : (
            <div className="space-y-1">
              {tickets.map((ticket) => {
                const age = daysAgo(ticket.createdAt);
                const isHigh = ticket.priority === "HIGH";
                return (
                  <div
                    key={ticket.id}
                    className="flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-lg"
                  >
                    <span
                      className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                        isHigh ? "bg-red-500" : "bg-amber-400"
                      }`}
                    />

                    <p className="flex-1 min-w-0 text-sm text-slate-800 truncate">
                      {ticket.title}
                    </p>

                    {isHigh && (
                      <span className="shrink-0 text-[11px] font-semibold text-red-600 bg-red-50 rounded-full px-2 py-0.5">
                        HIGH
                      </span>
                    )}

                    <span className="shrink-0 text-xs text-slate-400 w-16 text-right">
                      {age === 0 ? "today" : `${age}d old`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AttentionQueueCard;