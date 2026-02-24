import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home.js";
import { Toaster } from "react-hot-toast";
import { SignUp } from "./Pages/SignUp.js";
import { LogIn } from "./Pages/LogIn.js";
import { Dashboard } from "./Pages/Dashboard.js";
import { ForgetPassword } from "./Pages/ForgetPassword.js";
import { ResetPassword } from "./Pages/ResetPassword.js";
import Layout from "./Components/Layout.js";
import AddNewProject from "./Pages/Subpages/AddNewProject.js";
import ProjectsList from "./Pages/Subpages/ProjectsList.js";
import EditProject from "./Pages/Subpages/EditProject.js";
import ProjectMembers from "./Pages/ProjectMembers.js";
import InviteMembers from "./Pages/Subpages/InviteMembers.js";
import AddNewEpic from "./Pages/Epics/AddNewEpic.js";
import Tasks from "./Pages/Tasks/Tasks.js";
import GetEpics from "./Pages/Epics/GetEpics.js";

const routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/add-new-project",
        element: <AddNewProject />
      },
      {
        path: "/projects",
        element: <ProjectsList />
      },
      {
        path: "/invite-members",
        element: <InviteMembers />
      },
      {
        path: "/projects/:projectId",
        children: [
          {
            path: "edit-project",
            element: <EditProject />
          },
          {
            path: "members",
            element: <ProjectMembers />
          },
          {
            path: "epics",
            element: <GetEpics />
          },
          {
            path: "epics/new",
            element: <AddNewEpic />
          },
          {
            path: "tasks",
            element: <Tasks />
          }
        ]
      }
    ]
  },

  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/login",
    element: <LogIn />
  },

  {
    path: "/forget-password",
    element: <ForgetPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  }
]);

export default function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routes} />
    </div>
  );
}
