import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/profiles/me/");
  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await api.patch("/profiles/update/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getPublicProfile = async (userId) => {
  const response = await api.get(`/profiles/${userId}/`);

  return response.data;
};

export const getSimilarLearners = async () => {
  const response = await api.get("/profiles/similar/");

  return response.data;
};
