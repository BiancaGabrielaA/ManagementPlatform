import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTeams } from "../../api/teams.api";
import type { Team } from "../../api/teams.api";

function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const data = await getMyTeams();
      setTeams(data);
    } catch {
      setError("Nu am putut încărca echipele.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="p-6 text-sm text-slate-500">Se încarcă echipele...</p>;
  }

  if (error) {
    return <p className="p-6 text-sm text-red-600">{error}</p>;
  }

  if (teams.length === 0) {
    return <p className="p-6 text-sm text-slate-500">Nu faci parte din nicio echipă.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Echipele mele</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => navigate(`/teams/${team.id}`)}
            className="text-left rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition"
          >
            <p className="font-medium text-slate-900">{team.name}</p>
            {team.description && (
              <p className="text-sm text-slate-500 mt-1">{team.description}</p>
            )}
            <p className="text-xs text-slate-400 mt-2">
              {team.users?.length ?? 0} membri
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TeamsPage;