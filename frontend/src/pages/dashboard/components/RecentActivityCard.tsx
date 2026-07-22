import { useEffect, useState } from "react";
import { getRecentActivities } from "../../../api/activities.api";
import type { Activity } from "../../../api/activities.api";

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TYPE_DOT: Record<string, string> = {
  TICKET_CREATED: "bg-emerald-500",
  TICKET_ASSIGNED: "bg-blue-500",
  TICKET_STATUS_CHANGED: "bg-amber-500",
  COMMENT_ADDED: "bg-purple-500",
};

const DEFAULT_DOT = "bg-slate-400";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function RecentActivityCard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRecentActivities(5)
      .then(setActivities)
      .catch(() => setError("Could not load recent activity."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-base font-semibold text-slate-900 tracking-tight">
          Recent Activity
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          Across your teams
        </span>
      </div>

      {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <>
          {activities.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-4">
              No recent activity yet.
            </p>
          ) : (
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-100" />

              <div className="space-y-4">
                {activities.map((activity) => {
                  const dotColor = TYPE_DOT[activity.type] ?? DEFAULT_DOT;
                  return (
                    <div key={activity.id} className="relative flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div
                          className={`w-3.5 h-3.5 rounded-full ring-4 ring-white ${dotColor}`}
                        />
                      </div>

                      <p className="flex-1 min-w-0 text-sm text-slate-800 truncate">
                        {activity.description}
                      </p>

                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-slate-300 text-white flex items-center justify-center text-[8px] font-bold">
                          {getInitials(activity.team.name)}
                        </span>
                        {activity.team.name}
                      </span>

                      <span className="shrink-0 text-xs text-slate-400 w-14 text-right">
                        {timeAgo(activity.createdAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RecentActivityCard;