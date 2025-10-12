import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home.js";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { SignUp } from "./Pages/SignUp.js";

let routes = createBrowserRouter([
  {
    path: "/",
    element: <SignUp />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
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
