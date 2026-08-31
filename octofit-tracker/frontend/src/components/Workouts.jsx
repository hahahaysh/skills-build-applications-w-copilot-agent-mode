import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const normalized = typeof codespaceName === 'string' ? codespaceName.trim() : '';
  const codespaceEndpointPattern = '-8000.app.github.dev/api/workouts';

  return normalized ? 'https://' + normalized + codespaceEndpointPattern : 'http://localhost:8000';
}

function extractRecords(payload) {
  if (Array.isArray(payload)) return payload;

  const candidates = [payload?.workouts, payload?.data, payload?.results, payload?.items, payload?.records, payload?.rows];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkouts() {
      try {
        setLoading(true);
        const apiUrl = getApiBaseUrl();
        const response = await fetch(apiUrl + '/api/workouts/', { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setWorkouts(extractRecords(payload));
        setError('');
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError('Unable to load workouts from the API.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light">
        <h2 className="h4 mb-0">Workouts</h2>
      </div>
      <div className="list-group list-group-flush">
        {workouts.map((workout) => (
          <div key={workout._id || workout.id || workout.name} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h3 className="h6 mb-1">{workout.name}</h3>
                <p className="mb-1 text-muted">Type: {workout.type || 'General'} • Focus: {workout.focus || 'General fitness'}</p>
                <small className="text-secondary">Difficulty: {workout.difficulty || 'Moderate'} • {workout.durationMinutes || 0} minutes</small>
              </div>
              <span className="badge bg-success">{workout.type || 'Workout'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
