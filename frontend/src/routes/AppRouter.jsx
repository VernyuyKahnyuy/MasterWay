import { Routes, Route } from "react-router-dom";

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
import AboutPage from "../pages/AboutPage";
import MakeMeAdminPage from "../pages/MakeMeAdminPage";
import AdminModePage from "../pages/AdminModePage";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRouter() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/" element={<RoomListPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profiles/:userId" element={<PublicProfilePage />} />
      {/* Not linked anywhere — secret admin elevation page */}
      <Route path="/make-me-admin" element={<MakeMeAdminPage />} />
      <Route path="/admin-mode" element={<AdminModePage />} />

      {/* ── Semi-public: view room/lesson content, interactive parts gated inline ── */}
      <Route path="/rooms/:id" element={<RoomDetailPage />} />
      <Route path="/lessons/:id" element={<LessonDetailPage />} />

      {/* ── Requires login ── */}
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute
            icon="✨"
            title="Discover your next room"
            message="Log in to get AI-powered room recommendations personalised to your interests and learning history."
          >
            <RecommendationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interests"
        element={
          <ProtectedRoute
            icon="🎯"
            title="Manage your interests"
            message="Log in to set your learning interests and unlock personalised recommendations."
          >
            <InterestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute
            icon="🫂"
            title="Join the community"
            message="Log in to see what everyone is learning, post your own progress, and stay accountable."
          >
            <AccountabilityFeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            icon="📊"
            title="Your learning dashboard"
            message="Log in to track your progress, view your streak, and pick up where you left off."
          >
            <LearnerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            icon="👤"
            title="Your profile"
            message="Log in to view and edit your profile, bio, and profile picture."
          >
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inbox"
        element={
          <ProtectedRoute
            icon="💬"
            title="Your inbox"
            message="Log in to read and send messages to experts and fellow learners."
          >
            <InboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages/send"
        element={
          <ProtectedRoute
            icon="✉️"
            title="Send a message"
            message="Log in to send messages to experts and connect with the community."
          >
            <SendMessagePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages/send/:receiverId"
        element={
          <ProtectedRoute
            icon="✉️"
            title="Send a message"
            message="Log in to send messages to experts and connect with the community."
          >
            <SendMessagePage />
          </ProtectedRoute>
        }
      />

      {/* ── Expert routes ── */}
      <Route
        path="/expert"
        element={
          <ProtectedRoute
            icon="🎓"
            title="Expert portal"
            message="Log in to manage your rooms, create lessons, and grow your audience."
          >
            <ExpertDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/rooms"
        element={
          <ProtectedRoute
            icon="🏠"
            title="Your rooms"
            message="Log in to view and manage the rooms you've created."
          >
            <MyRoomsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/create-room"
        element={
          <ProtectedRoute
            icon="💡"
            title="Share your knowledge"
            message="Log in to create a room and reach learners all over the world with your ideas."
          >
            <CreateRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/create-lesson"
        element={
          <ProtectedRoute
            icon="📝"
            title="Create a lesson"
            message="Log in to add lessons — videos, notes, PDFs — to your rooms."
          >
            <CreateLessonPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/rooms/:id/edit"
        element={
          <ProtectedRoute
            icon="✏️"
            title="Edit room"
            message="Log in to update your room details."
          >
            <EditRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/room/:id"
        element={
          <ProtectedRoute
            icon="⚙️"
            title="Manage room"
            message="Log in to manage your room's lessons and settings."
          >
            <ManageRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/lesson/:id/edit"
        element={
          <ProtectedRoute
            icon="✏️"
            title="Edit lesson"
            message="Log in to edit your lesson content."
          >
            <EditLessonPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;
