import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SigninPage from "./pages/SignIn/SigninPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AddProductPage from "./pages/ProductManagement/AddProductPage/AddProductPage";
import ProductListPage from "./pages/ProductManagement/ProductListPage/ProductListPage";
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
          element: <AddProductPage />,
        },
        {
          path: "products",
          element: <ProductListPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
