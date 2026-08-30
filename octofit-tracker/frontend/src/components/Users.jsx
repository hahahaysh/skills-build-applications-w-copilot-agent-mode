import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const normalized = typeof codespaceName === 'string' ? codespaceName.trim() : '';
  const codespaceEndpointPattern = '-8000.app.github.dev/api/users';

  return normalized ? 'https://' + normalized + codespaceEndpointPattern : 'http://localhost:8000';
}

function extractRecords(payload) {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.users,
    payload?.data,
    payload?.results,
    payload?.items,
    payload?.records,
    payload?.rows
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        setLoading(true);
        const apiUrl = getApiBaseUrl();
        const response = await fetch(apiUrl + '/api/users/', { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setUsers(extractRecords(payload));
        setError('');
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError('Unable to load users from the API.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUsers();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading users...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light">
        <h2 className="h4 mb-0">Users</h2>
      </div>
      <div className="list-group list-group-flush">
        {users.map((user) => (
          <div key={user._id || user.id || `${user.name}-${user.email}`} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h3 className="h6 mb-1">{user.name}</h3>
                <p className="mb-1 text-muted">{user.email}</p>
                <small className="text-secondary">Grade: {user.grade || 'N/A'} • Team: {user.teamName || user.team || 'Unassigned'}</small>
              </div>
              <span className={`badge ${user.isActive === false ? 'bg-secondary' : 'bg-success'}`}>
                {user.isActive === false ? 'Inactive' : 'Active'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
