import api from "./api";

export const getCommentsByRoom = async (roomId) => {
  const response = await api.get(`community/?room=${roomId}`);
  const data = response.data;
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const createComment = async (
  roomId,
  text
) => {

  const response = await api.post(
    "community/create/",
    {
      room: roomId,
      text,
    }
  );

  return response.data;
};