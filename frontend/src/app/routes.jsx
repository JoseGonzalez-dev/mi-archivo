import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import FileManager from '../features/files/components/FileManager';
import DashboardLayout from '../shared/components/DashboardLayout';

// Simple ProtectedRoutes helper (local, minimal)
const ProtectedRoutes = ({ accesBy = 'authenticated', children }) => {
  const userStr = localStorage.getItem('user');
  const isAuth = !!userStr;

  if (accesBy === 'authenticated') {
    return isAuth ? children : <Navigate to="/login" replace />;
  }

  if (accesBy === 'non-authenticated') {
    return !isAuth ? children : <Navigate to="/files" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoutes accesBy="authenticated">
        <DashboardLayout />
      </ProtectedRoutes>
    ),
    errorElement: <div>Error</div>,
    children: [
      {
        path: '',
        element: <FileManager />,
      },
      {
        path: 'files',
        element: <FileManager />,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <ProtectedRoutes accesBy="non-authenticated">
        <div className="app-container">
          <LoginForm />
        </div>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/register',
    element: (
      <ProtectedRoutes accesBy="non-authenticated">
        <div className="app-container">
          <RegisterForm />
        </div>
      </ProtectedRoutes>
    ),
  },
  {
    path: '/*',
    element: <div>404 not found</div>,
  },
]);

const MyRouter = () => <RouterProvider router={router} />;
export default MyRouter;
