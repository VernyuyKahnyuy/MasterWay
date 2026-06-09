import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RoomListPage from "../pages/RoomListPage";
import RoomDetailPage from "../pages/RoomDetailPage";

function AppRouter() {
  return (
      <Routes>

        <Route path="/" element={<RoomListPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/rooms/:id" element={<RoomDetailPage />} />

      </Routes>
  );
}

export default AppRouter;