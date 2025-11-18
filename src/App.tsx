import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import { Toaster } from "react-hot-toast";
import { SignUp } from "./Pages/SignUp";
import { LogIn } from "./Pages/LogIn";
import { Dashboard } from "./Pages/Dashboard";
import { ForgetPassword } from "./Pages/ForgetPassword";
import { ResetPassword } from "./Pages/ResetPassword";
import Layout from "./Components/Layout";

const routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
  },

  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },

  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

export default function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routes} />
    </div>
  );
}
