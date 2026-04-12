import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../views/LandingPage/Home';

/**
 * Componente que maneja la lógica de la raíz (/).
 * Si el usuario está autenticado, lo redirige a su dashboard correspondiente.
 * Si no, muestra la Landing Page.
 */
const HomeRedirect = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return null; // O un spinner

    if (!isAuthenticated) {
        return <LandingPage />;
    }

    // Redirección inteligente basada en ROL
    switch (user?.role) {
        case 'ADMIN':
            return <Navigate to="/admin" replace />;
        case 'VENDEDOR':
            return <Navigate to="/vendedor/dashboard" replace />;
        case 'CLIENTE':
            return <Navigate to="/cliente/home" replace />;
        default:
            return <LandingPage />;
    }
};

export default HomeRedirect;
