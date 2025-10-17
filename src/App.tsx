import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home.js";
import { Toaster } from "react-hot-toast";
import { SignUp } from "./Pages/SignUp.js";
import { LogIn } from "./Pages/LogIn.js";
import { Dashboard } from "./Pages/Dashboard.js";
import { ForgetPassword } from "./Pages/ForgetPassword.js";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <SignUp />,
  },
  {
    path: "/home",
    element: <Home />,
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
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
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
