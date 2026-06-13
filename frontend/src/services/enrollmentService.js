import api from "./api";

export const enrollInRoom = async (roomId) => {

  const response = await api.post(
    "enrollments/create/",
    {
      room: roomId,
    }
  );

  return response.data;
};