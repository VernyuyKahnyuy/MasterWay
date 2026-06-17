import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RoomListPage from "../pages/RoomListPage";
import RoomDetailPage from "../pages/RoomDetailPage";
import LessonDetailPage from "../pages/LessonDetailPage";
import RecommendationsPage from "../pages/RecommendationPage";
import InterestsPage from "../pages/InterestsPage";
import ExpertDashboardPage from "../pages/ExpertDashboardPage";
import MyRoomsPage from "../pages/MyRoomsPage";
import CreateRoomPage from "../pages/CreateRoomPage";
import CreateLessonPage from "../pages/CreateLessonPage";
import ManageRoomPage from "../pages/ManageRoomPage";
import EditLessonPage from "../pages/EditLessonPage";
import LearnerDashboardPage from "../pages/LearnerDashboardPage";
import ProfilePage from "../pages/ProfilePage";
import InboxPage from "../pages/InboxPage";
import SendMessagePage from "../pages/SendMessagePage";
import PublicProfilePage from "../pages/PublicProfilePage";
import AccountabilityFeedPage from "../pages/AccountabilityFeedPage";
import EditRoomPage from "../pages/EditRoomPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoomListPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/rooms/:id" element={<RoomDetailPage />} />

      <Route path="/lessons/:id" element={<LessonDetailPage />} />

      <Route path="/recommendations" element={<RecommendationsPage />} />

      <Route path="/interests" element={<InterestsPage />} />

      <Route path="/expert" element={<ExpertDashboardPage />} />

      <Route path="/expert/rooms" element={<MyRoomsPage />} />

      <Route path="/expert/create-room" element={<CreateRoomPage />} />

      <Route path="/expert/create-lesson" element={<CreateLessonPage />} />

      <Route path="/expert/rooms/:id/edit" element={<EditRoomPage />} />

      <Route path="/expert/room/:id" element={<ManageRoomPage />} />

      <Route path="/expert/lesson/:id/edit" element={<EditLessonPage />} />

      <Route path="/dashboard" element={<LearnerDashboardPage />} />

      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/inbox" element={<InboxPage />} />

      <Route path="/messages/send" element={<SendMessagePage />} />

      <Route path="/messages/send/:receiverId" element={<SendMessagePage />} />

      <Route path="/profiles/:userId" element={<PublicProfilePage />} />

      <Route path="/feed" element={<AccountabilityFeedPage />} />
    </Routes>
  );
}

export default AppRouter;
