import { useLocation, Navigate } from 'react-router-dom';

function CheckAuth({ isAuthenticated, user, children }) {
    const location = useLocation();

    // Allow ALL users (authenticated and unauthenticated) to access /shop routes
    if (location.pathname.startsWith('/shop')) {
        return children;
    }

    // Allow unauthenticated users to access login/register pages
    if (!isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
        return children;
    }

    // Allow unauthenticated users to access home page
    if (!isAuthenticated && location.pathname === '/') {
        return children;
    }

    // Redirect authenticated users away from login/register pages
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
        if (user?.role === 'admin') {
            return <Navigate to='/admin/dashboard' replace />;
        }
        return <Navigate to='/shop' replace />;
    }

    // Allow authenticated users to access all other routes
    return children;
}

export default CheckAuth;
