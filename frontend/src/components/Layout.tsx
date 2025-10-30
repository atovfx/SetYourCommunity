import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Settings, MessageSquare, BarChart3, LogOut, Plus } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e7eb',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8' }}>DM Manager</h1>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>{user?.name}</p>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '10px' }}>
              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive('/dashboard') ? '#1d4ed8' : '#4b5563',
                  backgroundColor: isActive('/dashboard') ? '#eff6ff' : 'transparent',
                  fontWeight: isActive('/dashboard') ? '600' : 'normal',
                }}
              >
                <Home size={20} style={{ marginRight: '10px' }} />
                Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link
                to="/accounts/setup"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive('/accounts/setup') ? '#1d4ed8' : '#4b5563',
                  backgroundColor: isActive('/accounts/setup') ? '#eff6ff' : 'transparent',
                  fontWeight: isActive('/accounts/setup') ? '600' : 'normal',
                }}
              >
                <Plus size={20} style={{ marginRight: '10px' }} />
                Ajouter un compte
              </Link>
            </li>
          </ul>
        </nav>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 15px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <LogOut size={20} style={{ marginRight: '10px' }} />
          Déconnexion
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f9fafb' }}>
        <Outlet />
      </main>
    </div>
  );
}


