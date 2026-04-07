import { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router";
import { ProductCatalog } from "../components/products/ProductCatalog.tsx";

const FullLayout = lazy(() => import('../layouts/full/FullLayout'));
const BlankLayout = lazy(() => import('../layouts/blank/BlankLayout'));

const Dashboard = lazy(() => import('../views/dashboards/Dashboard'));
const Typography = lazy(() => import("../views/typography/Typography"));
const Table = lazy(() => import("../views/tables/Table"));
const Category = lazy(() => import("../views/categories/Category"));
const Form = lazy(() => import("../views/forms/Form"));
const Shadow = lazy(() => import("../views/shadows/Shadow"));
const Alert = lazy(() => import("../views/alerts/Alerts"));
const Solar = lazy(() => import("../views/icons/Solar"));
const Login = lazy(() => import('../views/auth/login/Login'));
const Register = lazy(() => import('../views/auth/login/Register')); //
const SamplePage = lazy(() => import('../views/sample-page/SamplePage'));
const Error = lazy(() => import('../views/auth/error/Error'));

const ProductDetail = lazy(() => import('../components/products/ProductDetail'));
const AddProduct = lazy(() => import('../components/products/AddProduct'));

const AiPlayground = lazy(() => import('../views/ai-playground/AiPlayground'));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', exact: true, element: <Dashboard /> },
      { path: '/products', exact: true, element: <ProductCatalog /> },
      { path: '/products/add', exact: true, element: <AddProduct /> },
      { path: '/products/:id', exact: true, element: <ProductDetail /> },
      { path: '/ui/typography', exact: true, element: <Typography /> },
      { path: '/ui/table', exact: true, element: <Table /> },
      { path: '/ui/category', exact: true, element: <Category /> },
      { path: '/ui/form', exact: true, element: <Form /> },
      { path: '/ui/alert', exact: true, element: <Alert /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '/icons/solar', exact: true, element: <Solar /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/ai-playground', exact: true, element: <AiPlayground /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> }, // ← NUEVO
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;