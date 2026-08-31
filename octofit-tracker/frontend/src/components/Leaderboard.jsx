import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const normalized = typeof codespaceName === 'string' ? codespaceName.trim() : '';
  const codespaceEndpointPattern = '-8000.app.github.dev/api/leaderboard';

  return normalized ? 'https://' + normalized + codespaceEndpointPattern : 'http://localhost:8000';
}

function extractRecords(payload) {
  if (Array.isArray(payload)) return payload;

  const candidates = [payload?.leaderboard, payload?.data, payload?.results, payload?.items, payload?.records, payload?.rows];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeaderboard() {
      try {
        setLoading(true);
        const apiUrl = getApiBaseUrl();
        const response = await fetch(apiUrl + '/api/leaderboard/', { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setEntries(extractRecords(payload));
        setError('');
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError('Unable to load leaderboard from the API.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light">
        <h2 className="h4 mb-0">Leaderboard</h2>
      </div>
      <div className="list-group list-group-flush">
        {entries.map((entry) => (
          <div key={entry._id || entry.id || `${entry.rank}-${entry.name}`} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-warning text-dark me-2">#{entry.rank || 0}</span>
                <strong>{entry.name}</strong>
              </div>
              <span className="text-primary fw-semibold">{entry.points || 0} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
