import api from "./api";

export const getRoomUpdates = async (roomId) => {
  const response = await api.get(`/accountability/?room=${roomId}`);

  return response.data;
};

export const createUpdate = async (data) => {
  const response = await api.post("/accountability/create/", data);

  return response.data;
};
