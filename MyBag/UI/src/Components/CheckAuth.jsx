import { useLocation, Navigate } from 'react-router-dom';

function CheckAuth({ isAuthenticated, user, children }) {
    const location = useLocation();

    // Debug logs to verify role and path
    console.log('CheckAuth:', { isAuthenticated, user, pathname: location.pathname });

    // Additional detailed debug logs for auth state
    if (!isAuthenticated) {
        console.log('CheckAuth: User is not authenticated');
    } else {
        if (!user) {
            console.log('CheckAuth: Authenticated but user object is null or undefined');
        } else {
            console.log('CheckAuth: Authenticated with user role:', user.role);
        }
    }

    if (!isAuthenticated) {
        if (location.pathname === '/' || location.pathname.includes('/d') || location.pathname.includes('/register') || location.pathname.includes('/shop')) {
            return children;
        }
        return <Navigate to='/login' replace />;
    }

    if (isAuthenticated) {
        if (location.pathname.includes('/login') || location.pathname.includes('/register')) {
            if (user?.role === 'admin') {
                return <Navigate to='/admin/dashboard' replace />;
            }
            if (user?.role === 'user' || user?.role === 'users') {
                return <Navigate to='/shop' replace />;
            }
            // Default redirect for other roles
            return <Navigate to='/' replace />;
        }

        if (user?.role === 'admin' && location.pathname.startsWith('/shop')) {
            return <Navigate to='/admin/dashboard' replace />;
        }

        if ((user?.role === 'user' || user?.role === 'users') && !location.pathname.startsWith('/shop')) {
            return <Navigate to='/shop' replace />;
        }
    }

    // Additional fallback: if user role is missing or unexpected, allow access to children
    if (!user?.role) {
        console.warn('CheckAuth: user role is missing, allowing access by default');
        return children;
    }

    return children;
}

export default CheckAuth;
