import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SigninPage from "./pages/SignIn/SigninPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProductFormPage from "./pages/ProductManagement/ProductFormPage/ProductFormPage";
import ProductListPage from "./pages/ProductManagement/ProductListPage/ProductListPage";
import CategoryListPage from "./pages/CategoryManagement/CategoryListPage/CategoryListPage";
import CategoryFormPage from "./pages/CategoryManagement/CategoryFormPage/CategoryFormPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <SigninPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "dashboard",
          element: <DashboardPage />,
        },
        {
          path: "products/add",
          element: <ProductFormPage />,
        },
        {
          path: "products/edit/:id",
          element: <ProductFormPage />,
        },
        {
          path: "products",
          element: <ProductListPage />,
        },
        {
          path: "categories/add",
          element: <CategoryFormPage />,
        },
        {
          path: "categories/edit/:id",
          element: <CategoryFormPage />,
        },
        {
          path: "categories",
          element: <CategoryListPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
