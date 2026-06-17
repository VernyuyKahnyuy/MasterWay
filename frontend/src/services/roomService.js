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

export const getMyRooms = async () => {
  const response = await api.get(
    "/rooms/my-rooms/"
  );

  return response.data;
}

export const updateRoom = async (id, formData) => {
  const response = await api.patch(`/rooms/${id}/update/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const createRoom = async (
  formData
) => {
  const response = 
    await api.post(
      "/rooms/create/", 
      formData, 
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;

};