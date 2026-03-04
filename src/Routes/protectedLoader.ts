import { redirect } from "react-router-dom";
import { store } from "@/Store/store";

export default function ProtectedLoader() {
  const isAuthenticated = store.getState().auth.isAuthenticated;

  if (!isAuthenticated) {
    throw redirect("/login"); //Why throw redirect? Because Data Loaders in React Router v6 expect a thrown response to handle redirection.
  }

  return null;
}
