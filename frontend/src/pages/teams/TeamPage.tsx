import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeamById } from "../../api/teams.api";
import type { Team } from "../../api/teams.api";;

import TeamBoard from "./components/TeamBoard"
import TeamTickets from "./components/TeamTickets";
import TeamSprints from "./components/TeamSprints";
import TeamBacklog from "./components/TeamBacklog";
import TeamMembers from "./components//TeamMembers";

type TabKey = "board" | "tickets" | "sprints" | "backlog" | "members";

const TABS: { key: TabKey; label: string }[] = [
  { key: "board", label: "Board" },
  { key: "tickets", label: "All Tickets" },
  { key: "sprints", label: "Sprints" },
  { key: "backlog", label: "Backlog" },
  { key: "members", label: "Team Members" }
];

function TeamPage() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("board");

  useEffect(() => {
    if (!id) return;
    fetchTeam(Number(id));
  }, [id]);

  const fetchTeam = async (teamId: number) => {
    setIsLoading(true);
    try {
      const data = await getTeamById(teamId);
      setTeam(data);
    } catch {
      setError("Nu am putut încărca echipa.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p className="p-6 text-sm text-slate-500">Se încarcă echipa...</p>;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;
  if (!team) return null;

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-slate-900">{team.name}</h1>
        {team.description && (
          <p className="text-sm text-slate-500 mt-1">{team.description}</p>
        )}
      </div>

      <div className="border-b border-slate-200 flex gap-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
              activeTab === tab.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "board" && <TeamBoard teamId={team.id} />}
      {activeTab === "tickets" && <TeamTickets teamId={team.id} />}
      {activeTab === "sprints" && <TeamSprints teamId={team.id} />}
      {activeTab === "backlog" && <TeamBacklog teamId={team.id} />}
      {activeTab === "members" && (
        <TeamMembers team={team} onMembersChanged={(_, users) => setTeam({ ...team, users })} />
      )}  
    </div>
  );
}

export default TeamPage;