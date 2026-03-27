import { isAuthenticated } from "@/Utils/auth";
import { redirect } from "react-router-dom";

export default function ProtectedLoader() {
  if (!isAuthenticated()) {
    throw redirect("/login");
  }

  return null;
}
