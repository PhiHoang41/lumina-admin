import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SigninPage from "./pages/SignIn/SigninPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProductFormPage from "./pages/ProductManagement/ProductFormPage/ProductFormPage";
import ProductListPage from "./pages/ProductManagement/ProductListPage/ProductListPage";
import CategoryListPage from "./pages/CategoryManagement/CategoryListPage/CategoryListPage";
import CategoryFormPage from "./pages/CategoryManagement/CategoryFormPage/CategoryFormPage";
import CouponListPage from "./pages/CouponManagement/CouponListPage/CouponListPage";
import CouponFormPage from "./pages/CouponManagement/CouponFormPage/CouponFormPage";
import UserListPage from "./pages/UserManagement/UserListPage/UserListPage";
import UserFormPage from "./pages/UserManagement/UserFormPage/UserFormPage";
import OrdersListPage from "./pages/OrderManagement/OrdersListPage/OrdersListPage";
import OrderDetailPage from "./pages/OrderManagement/OrderDetailPage/OrderDetailPage";
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
        {
          path: "coupons/add",
          element: <CouponFormPage />,
        },
        {
          path: "coupons/edit/:id",
          element: <CouponFormPage />,
        },
        {
          path: "coupons",
          element: <CouponListPage />,
        },
        {
          path: "users",
          element: <UserListPage />,
        },
        {
          path: "users/create",
          element: <UserFormPage />,
        },
        {
          path: "users/edit/:id",
          element: <UserFormPage />,
        },
        {
          path: "orders",
          element: <OrdersListPage />,
        },
        {
          path: "orders/:id",
          element: <OrderDetailPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
