import { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router-dom";

/* ================= LAYOUTS ================= */
const FullLayout = lazy(() => import('../layouts/full/FullLayout'));
const BlankLayout = lazy(() => import('../layouts/blank/BlankLayout'));

/* ================= DASHBOARD ================= */
const Dashboard = lazy(() => import('../views/dashboards/Dashboard'));

/* ================= AUTH ================= */
const Login = lazy(() => import('../views/auth/login/Login'));
const Error = lazy(() => import('../views/auth/error/Error'));

/* ================= REGISTER ================= */
const RegisterFull = lazy(() => import('../views/auth/Pages/RegisterFull'));

/* ================= ROUTER ================= */
const router = createBrowserRouter([

  // 🔹 DASHBOARD (MatDash)
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { index: true, element: <Dashboard /> },
    ],
  },

  // 🔹 LOGIN (usa BlankLayout)
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: 'auth/login', element: <Login /> },
    ],
  },

  // 🔥 REGISTER SIN LAYOUT (FULL SCREEN)
  {
    path: '/auth/register',
    element: <RegisterFull />,
  },

  // 🔹 ERRORES
  {
    path: '/auth/404',
    element: <Error />,
  },

  // 🔹 REDIRECCIÓN GLOBAL
  {
    path: '*',
    element: <Navigate to="/auth/404" />,
  }

]);

export default router;