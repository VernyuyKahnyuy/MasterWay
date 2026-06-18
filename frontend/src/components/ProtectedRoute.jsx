import { getCurrentUserId } from "../utils/auth";
import LoginWall from "./LoginWall";

export default function ProtectedRoute({ children, icon, title, message }) {
  const isLoggedIn = !!getCurrentUserId();
  if (!isLoggedIn) {
    return <LoginWall icon={icon} title={title} message={message} />;
  }
  return children;
}
