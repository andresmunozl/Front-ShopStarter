import { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router";
import { ProductCatalog } from "../components/products/ProductCatalog.tsx";
import ProtectedRoute from './ProtectedRoute.tsx';
import HomeRedirect from './HomeRedirect.tsx';

// Layouts
const FullLayout = lazy(() => import('../layouts/full/FullLayout'));
const BlankLayout = lazy(() => import('../layouts/blank/BlankLayout'));

// Public Views
const LandingPage = lazy(() => import('../views/LandingPage/Home'));
const Login = lazy(() => import('../views/auth/login/Login'));
const Register = lazy(() => import('../views/auth/register/Register'));
const Error = lazy(() => import('../views/auth/error/Error'));

// Shared / Product Views
const ProductDetail = lazy(() => import('../components/products/ProductDetail'));
const Dashboard = lazy(() => import('../views/dashboards/Dashboard'));

// Specific Role Views
const ClienteHome = lazy(() => import('../views/cliente/Home.tsx'));
const BrowseProducts = lazy(() => import('../views/cliente/BrowseProducts.tsx'));
const VendedorDashboard = lazy(() => import('../views/vendedor/Dashboard.tsx'));
const ManageProducts = lazy(() => import('../views/vendedor/ManageProducts.tsx'));
const AdminDashboard = lazy(() => import('../views/admin/AdminDashboard.tsx'));

// UI / Sample Views (maintained for reference)
const Typography = lazy(() => import("../views/typography/Typography"));
const Table = lazy(() => import("../views/tables/Table"));
const Form = lazy(() => import("../views/forms/Form"));
const Shadow = lazy(() => import("../views/shadows/Shadow"));
const Alert = lazy(() => import("../views/alerts/Alerts"));
<<<<<<< HEAD
const LocationsMaps = lazy(() => import("../components/locations/LocationsMaps"));



// icons
=======
>>>>>>> main
const Solar = lazy(() => import("../views/icons/Solar"));
const SamplePage = lazy(() => import('../views/sample-page/SamplePage'));

const Router = [
<<<<<<< HEAD
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', exact: true, element: <Dashboard /> },
      { path: '/ui/typography', exact: true, element: <Typography /> },
      { path: '/ui/table', exact: true, element: <Table /> },
      { path: '/ui/form', exact: true, element: <Form /> },
      { path: '/ui/alert', exact: true, element: <Alert /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '/icons/solar', exact: true, element: <Solar /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
       { path: '/apps/locations', exact: true, element: <LocationsMaps /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
=======
  // 1. PUBLIC ROUTES (Landing & Auth)
>>>>>>> main
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { index: true, element: <HomeRedirect /> },
      {
        path: 'auth',
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: '404', element: <Error /> },
        ]
      },
    ],
  },

  // 2. CLIENT PROTECTED ROUTES
  {
    path: '/cliente',
    element: <ProtectedRoute allowedRoles={['CLIENTE']} />,
    children: [
      {
        path: '',
        element: <FullLayout />,
        children: [
          { path: 'home', element: <ClienteHome /> },
          { path: 'productos', element: <BrowseProducts /> },
          { path: 'reservas', element: <SamplePage /> },
        ]
      }
    ]
  },

  // 3. VENDOR PROTECTED ROUTES
  {
    path: '/vendedor',
    element: <ProtectedRoute allowedRoles={['VENDEDOR']} />,
    children: [
      {
        path: '',
        element: <FullLayout />,
        children: [
          { path: 'dashboard', element: <VendedorDashboard /> },
          { path: 'productos', element: <ManageProducts /> },
          { path: 'reservas', element: <Table /> },
        ]
      }
    ]
  },

  // 4. ADMIN PROTECTED ROUTES
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        path: '',
        element: <FullLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
        ]
      }
    ]
  },

  // 5. COMMON / UI ROUTES (Inside FullLayout but not protected for demo/ref)
  {
    path: '/app',
    element: <FullLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductCatalog /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'ui/typography', element: <Typography /> },
      { path: 'ui/table', element: <Table /> },
      { path: 'ui/form', element: <Form /> },
      { path: 'ui/alert', element: <Alert /> },
      { path: 'ui/shadow', element: <Shadow /> },
      { path: 'icons/solar', element: <Solar /> },
      { path: 'sample-page', element: <SamplePage /> },
    ],
  },

  // 5. CATCH-ALL
  {
    path: '*',
    element: <Navigate to="/auth/404" replace />,
  },
];

const router = createBrowserRouter(Router);

export default router;