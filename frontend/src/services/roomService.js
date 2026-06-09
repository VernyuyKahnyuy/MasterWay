import api from "./api";

export const getRooms = async () => {

  const response =
    await api.get("rooms/");

  return response.data;
};

export const getRoom = async (id) => {

  const response =
    await api.get(`rooms/${id}/`);

  return response.data;
};