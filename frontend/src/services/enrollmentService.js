import api from "./api";

export const enrollInRoom = async (roomId) => {
  const response = await api.post("enrollments/create/", { room: roomId });
  return response.data;
};

export const getEnrollments = async () => {
  const response = await api.get("enrollments/");
  const data = response.data;
  return Array.isArray(data) ? data : (data?.results ?? []);
};