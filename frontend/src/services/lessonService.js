import api from "./api";

export const getLessonsByRoom = async (roomId) => {
  const response = await api.get(`lessons/?room=${roomId}`);
  const data = response.data;
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const getAllLessons = async () => {
  const response = await api.get("lessons/");
  const data = response.data;
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const getLesson = async (id) => {
  const response = await api.get(`lessons/${id}/`);
  return response.data;
};

export const createLesson = async (formData) => {
  const response = await api.post("/lessons/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateLesson = async (lessonId, formData) => {
  const response = await api.put(`/lessons/${lessonId}/update`, formData);
  return response.data;
};

export const deleteLesson = async (lessonId) => {
  const response = await api.delete(`/lessons/${lessonId}/`);
  return response.data;
};
