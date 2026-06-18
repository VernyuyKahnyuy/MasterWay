import api from "./api";

export const getRoomUpdates = async (roomId) => {
  const response = await api.get(`/accountability/?room=${roomId}`);
  const data = response.data;
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const getAllUpdates = async () => {
  const response = await api.get("/accountability/all/");
  const data = response.data;
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const createUpdate = async (data) => {
  const response = await api.post("/accountability/create/", data);
  return response.data;
};
