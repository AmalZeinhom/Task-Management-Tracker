import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignUp from "./Pages/SignUp";
// import Layout from "./Components/Layout";
import Home from "./Pages/Home";

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
      <RouterProvider router={routes} />
    </div>
  );
}
