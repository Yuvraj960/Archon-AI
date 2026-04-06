import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Landing        from './pages/Landing';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Dashboard      from './pages/Dashboard';
import NewProject     from './pages/NewProject';
import DesignView     from './pages/DesignView';
import VersionHistory from './pages/VersionHistory';
import Navbar         from './components/layout/Navbar';
import useAuthStore   from './store/useAuthStore';

const queryClient = new QueryClient();

export default function App() {
  const { accessToken } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <Routes>
          <Route path="/"          element={accessToken ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/login"     element={accessToken ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register"  element={accessToken ? <Navigate to="/dashboard" replace /> : <Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"                    element={<Dashboard />} />
            <Route path="/projects/new"                 element={<NewProject />} />
            <Route path="/projects/:id"                 element={<DesignView />} />
            <Route path="/projects/:id/versions"        element={<VersionHistory />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
