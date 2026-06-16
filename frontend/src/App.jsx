import { BrowserRouter } from "react-router-dom";
import LearnerDashboardPage from "./pages/LearnerDashboardPage";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRouter";
import RecommendationsPage from "./pages/RecommendationPage";
import CreateRoomPage from "./pages/CreateRoomPage";
import ManageRoomPage from "./pages/ManageRoomPage";
import EditLessonPage from "./pages/EditLessonPage";
import ProfilePage from "./pages/ProfilePage";
import InboxPage from "./pages/InboxPage";
import SendMessagePage from "./pages/SendMessagePage";
import PublicProfilePage from "./pages/PublicProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
