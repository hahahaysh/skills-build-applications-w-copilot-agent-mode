import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

const navItems = [
  { label: 'Users', path: '/users' },
  { label: 'Teams', path: '/teams' },
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Workouts', path: '/workouts' }
];

function App() {
  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <p className="text-uppercase text-primary fw-semibold mb-1">Octofit Tracker</p>
          <h1 className="mb-0">Fitness dashboard</h1>
        </div>
        <div className="alert alert-light border mb-0 small text-muted">
          VITE_CODESPACE_NAME must be defined for Codespaces. If it is unset, the app falls back to localhost.
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded mb-4">
        <div className="container-fluid">
          <span className="navbar-brand me-3">Octofit</span>
          <div className="navbar-nav flex-row flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link px-3 py-2 rounded ${isActive ? 'bg-light text-dark' : 'text-white'}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
