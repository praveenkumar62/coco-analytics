import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import { NotyProvider } from './context/NotyContext';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/sidebar';
import type { ReactNode } from 'react';
import CocoList from './pages/CocoList';
import UsersList from './pages/UsersList';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './components/private-route';
import AuthRedirect from './components/auth-redirect';

function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div>
      {!isLogin && <Sidebar />}
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NotyProvider>
        <UserProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<AuthRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/coconut-info"
                element={
                  <PrivateRoute>
                    <CocoList />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/users-info"
                element={
                  <PrivateRoute>
                    <UsersList />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AppLayout>
        </UserProvider>
      </NotyProvider>
    </BrowserRouter>
  );
}

export default App;
