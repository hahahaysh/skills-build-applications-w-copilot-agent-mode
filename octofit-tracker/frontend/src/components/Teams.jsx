import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const normalized = typeof codespaceName === 'string' ? codespaceName.trim() : '';
  const codespaceEndpointPattern = '-8000.app.github.dev/api/teams';

  return normalized ? 'https://' + normalized + codespaceEndpointPattern : 'http://localhost:8000';
}

function extractRecords(payload) {
  if (Array.isArray(payload)) return payload;

  const candidates = [payload?.teams, payload?.data, payload?.results, payload?.items, payload?.records, payload?.rows];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeams() {
      try {
        setLoading(true);
        const apiUrl = getApiBaseUrl();
        const response = await fetch(apiUrl + '/api/teams/', { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setTeams(extractRecords(payload));
        setError('');
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError('Unable to load teams from the API.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTeams();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light">
        <h2 className="h4 mb-0">Teams</h2>
      </div>
      <div className="list-group list-group-flush">
        {teams.map((team) => (
          <div key={team._id || team.id || team.name} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="h6 mb-1">{team.name}</h3>
                <p className="mb-1 text-muted">Coach: {team.coach || 'TBD'}</p>
                <small className="text-secondary">Members: {Array.isArray(team.members) ? team.members.join(', ') : 'None yet'}</small>
              </div>
              <span className="badge bg-primary rounded-pill">{team.points ?? 0} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
