import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { logout } from '../../api/auth.api';

export default function Navbar() {
  const { user, accessToken, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to={accessToken ? "/dashboard" : "/"} className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Archon AI
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          {accessToken ? (
            <>
              <span className="text-gray-500">Hi, {user?.name || 'User'}</span>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition">Dashboard</Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">Sign In</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
