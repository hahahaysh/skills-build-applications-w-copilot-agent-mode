import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const normalized = typeof codespaceName === 'string' ? codespaceName.trim() : '';
  const codespaceEndpointPattern = '-8000.app.github.dev/api/activities';

  return normalized ? 'https://' + normalized + codespaceEndpointPattern : 'http://localhost:8000';
}

function extractRecords(payload) {
  if (Array.isArray(payload)) return payload;

  const candidates = [payload?.activities, payload?.data, payload?.results, payload?.items, payload?.records, payload?.rows];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      try {
        setLoading(true);
        const apiUrl = getApiBaseUrl();
        const response = await fetch(apiUrl + '/api/activities/', { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setActivities(extractRecords(payload));
        setError('');
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError('Unable to load activities from the API.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadActivities();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading activities...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light">
        <h2 className="h4 mb-0">Activities</h2>
      </div>
      <div className="list-group list-group-flush">
        {activities.map((activity) => (
          <div key={activity._id || activity.id || `${activity.type}-${activity.date}`} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h3 className="h6 mb-1">{activity.type}</h3>
                <p className="mb-1 text-muted">
                  {activity.userId?.name || activity.userName || 'Unknown athlete'}
                </p>
                <small className="text-secondary">
                  {activity.durationMinutes || 0} min • {activity.calories || 0} cal • {activity.distanceMiles ? `${activity.distanceMiles} mi` : 'Distance not logged'}
                </small>
              </div>
              <span className="badge bg-info text-dark">{new Date(activity.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
