import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Book from './pages/Book';
import AddBook from './pages/AddBook';
import NotFound from './pages/Page404';
import ReserveBook from './pages/ReserveBook';
import Register from './pages/Register';
import Configuration from './pages/Configuration';
import Organization from './pages/Organization';
import Invitation from './pages/Invitation';
import Reviews from './pages/Reviews';

export default function Router(props) {
  return useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" replace /> },
        { path: 'login', element: <Login /> },
        { path: 'login/organization', element: <Organization /> },
        { path: 'register', element: <Register /> },
        { path: 'register/:registrationToken', element: <Register /> },
        { path: 'accept-invite/:registrationToken', element: <Invitation /> },
        { path: '404', element: <NotFound /> }
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardLayout {...props} />,
      children: [
        { path: 'app', element: <Dashboard /> },
        { path: 'books', element: <Book /> },
        { path: 'reviews', element: <Reviews /> },
        { path: 'addBook', element: <AddBook /> },
        { path: 'reserveBook', element: <ReserveBook /> },
        { path: 'configuration', element: <Configuration /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
