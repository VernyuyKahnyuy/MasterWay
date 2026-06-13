import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RoomListPage from "../pages/RoomListPage";
import RoomDetailPage from "../pages/RoomDetailPage";
import LessonDetailPage from "../pages/LessonDetailPage";
import RecommendationsPage from "../pages/RecommendationPage";

function AppRouter() {
  return (
      <Routes>

        <Route path="/" element={<RoomListPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/rooms/:id" element={<RoomDetailPage />} />

        <Route path="/lessons/:id" element={<LessonDetailPage />} />

        <Route path="/recommendations" element={<RecommendationsPage />} />

      </Routes>
  );
}

export default AppRouter;